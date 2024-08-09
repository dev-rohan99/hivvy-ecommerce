import adminModel from "../models/adminModel.js";
import createError from "../utility/createError.js";
import { isEmail, isPhone } from "../utility/validate.js";
import { genHashPassword, verifyPassword } from "../utility/hash.js";
import { createAdminToken } from "../utility/token.js";
import { resetPasswordLink, sendActivationLink } from "../utility/sendMail.js";
import { getRandomCode, getRandomUsernameCode } from "../utility/math.js";


/**
 * User register
 * @param {*} req 
 * @route /api/v1/admin/register
 * @param {*} res 
 * @method POST
 */

export const adminSignup = async (req, res, next) => {
    
    try{

        // get form data
        const { name, email, password } = req.body;

        // validation
        if( !name || !password ){
            next(createError(400, 'All fields are required!'));
        }

        const adminEmail = await adminModel.findOne({email : email});
        if( adminEmail ){
            return next(createError(400, 'This email already exists!'));
        }
        
        // create access token
        let activationCode = getRandomCode(100000, 999999);

        // check activation code
        const checkActivationCode = await adminModel.findOne({accessToken : activationCode});

        if( checkActivationCode ){
            activationCode = getRandomCode(100000, 999999);
        }

        // genarate adminname
        const username = name.toLowerCase().split(" ").join("-");
        console.log(getRandomUsernameCode(username, 999, 999999));

        // create admin
        const admin = await adminModel.create({
            ...req.body,
            username: getRandomUsernameCode(username, 999, 999999),
            password: genHashPassword(password),
            accessToken: activationCode
        });

        if (!admin) {
            next(createError(404, 'User not created! Please try again.'));
        }

        if(admin){

            const activationToken  = createAdminToken({id : admin._id}, '30d');

            sendActivationLink(admin.email, {
                name : admin.firstName + ' ' + admin.surName,
                link : `${process.env.APP_URI + ':' + process.env.SERVER_PORT}/api/v1/admin/activate/${activationToken}`,
                code : activationCode
            });
            
            res.status(200).cookie('otp', admin.email, {
                sameSite : "none",
                secure: true,
                httpOnly: true,
                expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
            }).json({
                message : "Thank you for joining us!",
                admin : admin
            });

        }


    }catch(err){
        next(err);
    }

}

/**
 * User login
 * @param {*} req 
 * @route /api/v1/admin/login
 * @param {*} res
 * @method POST
 */

export const adminLogin = async (req, res, next) => {

    try{

        const {phoneOrEmail, password} = req.body;

        if(isEmail(phoneOrEmail)){

            if(!phoneOrEmail || !password){
                return next(createError(400, 'All fields are required!'));
            }
    
            if(!isEmail(phoneOrEmail)){
                return next(400, 'Invalid email address!');
            }
    
            const loginUserForEmail = await adminModel.findOne({email : phoneOrEmail});
            
            if(!loginUserForEmail){
                return next(createError(400, 'Your data could be not found!'));
            }else{
    
                if(!verifyPassword(password, loginUserForEmail.password)){
                    return next(createError(400, 'Your password not matched!'));
                }else{
    
                    const token = createAdminToken({admin: loginUserForEmail}, process.env.ACCESS_TOKEN_EXPIRE);
                    
                    return res.status(200).cookie('authToken', token, {
                        httpOnly: true,
                        secure: (process.env.APP_ENV === "PRODUCTION") ? true : false,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }).json({
                        message : "Welcome back! Lets explore.",
                        admin : loginUserForEmail,
                        token : token
                    });
    
                }
    
            }

        }else if(isPhone(phoneOrEmail)){

            if(!phoneOrEmail || !password){
                return next(createError(400, 'All fields are required!'));
            }
    
            if(!isPhone(phoneOrEmail)){
                return next(400, 'Invalid phone address!');
            }
    
            const loginUserForPhone = await adminModel.findOne({phone : phoneOrEmail});
            
            if(!loginUserForPhone){
                return next(createError(400, 'Your data could be not found!'));
            }else{
    
                if(!verifyPassword(password, loginUserForPhone.password)){
                    return next(createError(400, 'Your password not matched!'));
                }else{
    
                    const token = createAdminToken({admin: loginUserForPhone}, process.env.ACCESS_TOKEN_EXPIRE);
                    
                    return res.status(200).cookie('authToken', token, {
                        httpOnly: true,
                        secure: (process.env.APP_ENV === "PRODUCTION") ? true : false,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }).json({
                        message : "Welcome back! Lets explore.",
                        admin : loginUserForPhone,
                        token : token
                    });
    
                }
    
            }

        }else{
            return next(createError(400, 'Invalid phone or email address!'));
        }

    }catch(err){
        return next(err);
    }

}

/**
 * loggedin admin
 * @param {*} req 
 * @route /api/v1/admin/me
 * @param {*} res 
 * @method GET
 */

export const loggedInAdmin = async (req, res, next) => {

    try{
        const looggedinAdmin = await adminModel.findById(req.adminId).select("-password");

        if(!looggedinAdmin){
            next(createError(400, "User not match!"));
        }else{
            res.status(200).json({
                message : "User data stable!",
                admin : looggedinAdmin
            });
        }

    }catch(err){
        next(err);
    }

}

/**
 * user update profile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const adminUpdateProfile = async (req, res, next) => {

    try{

        const {id} = req.params;
        const data = req.body;

        const userUpdate = await userModel.findByIdAndUpdate(id, data, { new : true });

        if(userUpdate){
            return res.status(200).json({
                message : "Profile updated successfull!",
                user : userUpdate
            });
        }
        
        if(!userUpdate){
            return next(createError(400, "Profile update failed!"))
        }

    }catch(err){
        return next(err);
    }

}

/**
 * get all user data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const getAllUser = async (req, res, next) => {
    try{

        const { id } = req.params;

        const users = await userModel.find().select("-password").where("_id").ne(id);

        
        if(!users){
            return next(createError(400, "Data not found!"));
        }

        if(users){
            return res.status(200).json({
                message : "All user data finded!",
                users : users
            });
        }

    }catch(err){
        return next(err);
    }
}

/**
 * user logout controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const adminLogout = async (req, res, next) => {
    try{

        res.clearCookie("authToken");
        res.status(200).json({
            message : "Logout successfully complete!"
        });

    }catch(err){
        return next(err);
    }
}
