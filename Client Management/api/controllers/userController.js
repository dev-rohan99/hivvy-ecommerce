import userModel from "../models/userModel.js";
import createError from "../utility/createError.js";
import { isEmail, isPhone } from "../utility/validate.js";
import { genHashPassword, verifyPassword } from "../utility/hash.js";
import { createToken, verifyToken } from "../utility/token.js";
import { resetPasswordLink, sendActivationLink } from "../utility/sendMail.js";
import { getRandomCode, getRandomUsernameCode } from "../utility/math.js";


/**
 * User register
 * @param {*} req 
 * @route /api/v1/user/register
 * @param {*} res 
 * @method POST
 */

export const userSignup = async (req, res, next) => {
    
    try{

        // get form data
        const { name, email, password } = req.body;

        // validation
        if( !name || !password ){
            next(createError(400, 'All fields are required!'));
        }

        const userEmail = await userModel.findOne({email : email});
        if( userEmail ){
            return next(createError(400, 'This email already exists!'));
        }
        
        // create access token
        let activationCode = getRandomCode(100000, 999999);

        // check activation code
        const checkActivationCode = await userModel.findOne({accessToken : activationCode});

        if( checkActivationCode ){
            activationCode = getRandomCode(100000, 999999);
        }

        // genarate username
        const username = name.toLowerCase().split(" ").join("-");
        console.log(getRandomUsernameCode(username, 999, 999999));

        // create user
        const user = await userModel.create({
            ...req.body,
            username: getRandomUsernameCode(username, 999, 999999),
            password: genHashPassword(password),
            accessToken: activationCode
        });

        if (!user) {
            next(createError(404, 'User not created! Please try again.'));
        }

        if(user){

            const activationToken  = createToken({id : user._id}, '30d');

            sendActivationLink(user.email, {
                name : user.firstName + ' ' + user.surName,
                link : `${process.env.APP_URI + ':' + process.env.SERVER_PORT}/api/v1/user/activate/${activationToken}`,
                code : activationCode
            });
            
            res.status(200).cookie('otp', user.email, {
                sameSite : "none",
                secure: true,
                httpOnly: true,
                expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
            }).json({
                message : "Thank you for joining us!",
                user : user
            });

        }


    }catch(err){
        next(err);
    }

}

/**
 * User login
 * @param {*} req 
 * @route /api/v1/user/login
 * @param {*} res
 * @method POST
 */

export const userLogin = async (req, res, next) => {

    try{

        const {phoneOrEmail, password} = req.body;

        if(isEmail(phoneOrEmail)){

            if(!phoneOrEmail || !password){
                return next(createError(400, 'All fields are required!'));
            }
    
            if(!isEmail(phoneOrEmail)){
                return next(400, 'Invalid email address!');
            }
    
            const loginUserForEmail = await userModel.findOne({email : phoneOrEmail});
            
            if(!loginUserForEmail){
                return next(createError(400, 'Your data could be not found!'));
            }else{
    
                if(!verifyPassword(password, loginUserForEmail.password)){
                    return next(createError(400, 'Your password not matched!'));
                }else{
    
                    const token = createToken({user: loginUserForEmail}, process.env.ACCESS_TOKEN_EXPIRE);
                    
                    return res.status(200).cookie('authToken', token, {
                        httpOnly: true,
                        secure: (process.env.APP_ENV === "PRODUCTION") ? true : false,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }).json({
                        message : "Welcome back! Lets explore.",
                        user : loginUserForEmail,
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
    
            const loginUserForPhone = await userModel.findOne({phone : phoneOrEmail});
            
            if(!loginUserForPhone){
                return next(createError(400, 'Your data could be not found!'));
            }else{
    
                if(!verifyPassword(password, loginUserForPhone.password)){
                    return next(createError(400, 'Your password not matched!'));
                }else{
    
                    const token = createToken({user: loginUserForPhone}, process.env.ACCESS_TOKEN_EXPIRE);
                    
                    return res.status(200).cookie('authToken', token, {
                        httpOnly: true,
                        secure: (process.env.APP_ENV === "PRODUCTION") ? true : false,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }).json({
                        message : "Welcome back! Lets explore.",
                        user : loginUserForPhone,
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
 * loggedin user
 * @param {*} req 
 * @route /api/v1/user/me
 * @param {*} res 
 * @method GET
 */

export const loggedInUser = async (req, res, next) => {

    try{
        const looggedinUser = await userModel.findById(req.userId).select("-password");

        if(!loggedInUser){
            next(createError(400, "User not match!"));
        }else{
            res.status(200).json({
                message : "User data stable!",
                user : looggedinUser
            });
        }

    }catch(err){
        next(err);
    }

}

/**
 * account activate by sending email
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const accountActivation = async (req, res, next) => {
    
    try{

        // get token
        const { token } = req.params;

        if(!token){
            next(createError(400, 'Invalid activation url!'))
        }else{

            // token verify
            const tokenData = verifyToken(token);

            // check token
            if(!tokenData){
                next(createError(400, 'Invalid token!'));
            }

            if(tokenData){

                const userAccount = await userModel.findById(tokenData.id);

                if(userAccount.isActivate){
                    next(createError(400, 'Account already activate!'))
                }else{
                    await userModel.findByIdAndUpdate(tokenData.id, {
                        isActivate : true,
                        accessToken : ""
                    });

                    res.status(200).json({
                        message : "Account activated successfull!"
                    })
                }
                
            }

        }

    }catch(err){
        next(err);
    }

}

/**
 * account activate by code
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const accountActivateByCode = async (req, res, next) => {

    try{

        const { code } = req.body;
        // const user = await userModel.findOne({accessToken : code, isActivate : false});
        const user = await userModel.findOne().and([{accessToken : code}, {isActivate : false}]);

        if(!user){
            next(createError(400, 'Activation user not found!'));
        }else{

            if(user.isActivate == true){
                next(createError(400, 'Account already activated!'));
            }else{

                if(user.accessToken !== code){
                    next(createError(400, 'OTP code not matched!'));
                }else{
                    await userModel.findByIdAndUpdate(user.id, {
                        isActivate : true,
                        accessToken : ""
                    });
        
                    res.status(200).json({
                        message : "Account acctivated successfull!"
                    });
                }

            }

        }

    }catch(err){
        next(err);
    }

}

/**
 * find user account
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const findUserAccount = async (req, res, next) => {

    try{

        const { phoneOrEmail } = req.body;

        let emailData = null;
        let phoneData = null;

        if(isEmail(phoneOrEmail)){

            const emailUser = await userModel.findOne({email : phoneOrEmail})
            if(!emailUser){
                return next(createError(400, "Email user not found!"));
            }else{

                return res.status(200).cookie(
                    'findUser', 
                    JSON.stringify({
                        name : emailUser.firstName + ' ' + emailUser.surName,
                        email : emailUser.email,
                        avatar : emailUser.avatar
                    }), {
                        expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                    }
                ).json({
                    user : emailUser
                });

            }

        }else if(isPhone(phoneOrEmail)){

            const phoneUser = await userModel.findOne({phone : phoneOrEmail})
            if(!phoneUser){
                return next(createError(400, "Phone user not found!"));
            }else{

                return res.status(200).cookie(
                    'findUser', 
                    JSON.stringify({
                        name : phoneUser.firstName + ' ' + phoneUser.surName,
                        phone : phoneUser.phone,
                        avatar : phoneUser.avatar
                    }), {
                        expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                    }
                ).json({
                    user : phoneUser
                });

            }

        }else{
            return next(createError(400, "User not found!"));
        }

    }catch(err){
        next(err);
    }

}

/**
 * forgot password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const forgotPassword = async (req, res, next) => {

    try{

        const { email } = req.body;
        const user = await userModel.findOne({email : email});

        if(!email){
            next(createError(400, "User not found!"));
        }

        if(email){

            const passwordResetToken  = createToken({id : user._id}, '30m');

            // create access token
            let activationCode = getRandomCode(100000, 999999);

            // check activation code
            const checkActivationCode = await userModel.findOne({accessToken : activationCode});

            if( checkActivationCode ){
                activationCode = getRandomCode(100000, 999999);
            }

            resetPasswordLink(user.email, {
                name : user.firstName + ' ' + user.surName,
                link : `${process.env.APP_URI + ':' + process.env.SERVER_PORT}/api/v1/user/forgot-password/${passwordResetToken}`,
                code : activationCode
            });
            
            res.status(200).json({
                message : "Password reset link has sent to your email account!"
            });

        }

    }catch(err){
        next(err);
    }

}

/**
 * password reset by code
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const passwordResetAction = async (req, res, next) => {

    try{

        // get token
        const { token } = req.params;
        const { password } = req.body;

        if(!token){
            next(createError(400, 'Invalid activation url!'))
        }else{

            // token verify
            const tokenData = verifyToken(token);

            // check token
            if(!tokenData){
                next(createError(400, 'Invalid token!'));
            }

            if(tokenData){

                const userAccount = await userModel.findById(tokenData.id);

                if( !userAccount ){
                    next(createError(400, "Invalid user!"))
                }

                if( userAccount ){
                    await userModel.findByIdAndUpdate(userAccount._id, {
                        password : genHashPassword(password),
                        accessToken : ""
                    });

                    res.status(200).json({
                        message : "Password reset successfull!"
                    });
                }
                
            }

        }

    }catch(err){
        next(err);
    }

}

/**
 * resend accound activation link
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const resendAccountActivation = async (req, res, next) => {

    try{

        const { emailOrPhone } = req.body;

        if(isEmail(emailOrPhone)){

            const userEmail = await userModel.findOne({email : emailOrPhone});
            console.log(userEmail);

            if(!userEmail){
                next(createError(400, "User not found!"));
            }

            if(userEmail.isActivate){
                next(createError(400, "Account already activated!"))
            }
    
            // create access token
            let activationCode = getRandomCode(100000, 999999);
    
            // check activation code
            const checkActivationCode = await userModel.findOne({accessToken : activationCode});
    
            if( checkActivationCode ){
                activationCode = getRandomCode(100000, 999999);
            }
    
            if(userEmail){
    
                const activationToken  = createToken({id : userEmail._id}, '30d');
        
                sendActivationLink(userEmail.email, {
                    name : userEmail.firstName + ' ' + userEmail.surName,
                    link : `${process.env.APP_URI + ':' + process.env.SERVER_PORT}/api/v1/user/activate/${activationToken}`,
                    code : activationCode
                });
    
                await userModel.findByIdAndUpdate(userEmail._id, {
                    accessToken : activationCode
                });
                
                res.status(200).cookie('otp', userEmail.email, {
                    expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                }).json({
                    message : "User activation link send to your account! Check your email."
                });
    
            }

        }else if(isPhone(emailOrPhone)){

            const userPhone = await userModel.findOne({phone : emailOrPhone});

            if(!userPhone){
                next(createError(400, "User not found!"))
            }

            if(userPhone.isActivate){
                next(createError(400, "Account already activated!"))
            }
    
            // create access token
            let activationCode = getRandomCode(100000, 999999);
    
            // check activation code
            const checkActivationCode = await userModel.findOne({accessToken : activationCode});
    
            if( checkActivationCode ){
                activationCode = getRandomCode(100000, 999999);
            }
    
            if(userPhone){
        
                // sendSms(userPhone.phone, `Your OTP code is ${activationCode}`);
    
                await userModel.findByIdAndUpdate(userPhone._id, {
                    accessToken : activationCode
                });
                
                res.status(200).cookie('otp', userPhone.phone, {
                    expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                }).json({
                    message : "User activation OTP send to your phone number! Check your message!"
                });
    
            }

        }else{
            next(createError(400, "Invalid phone or email address!"));
        }

    }catch(err){
        next(err);
    }

}

/**
 * send user identification otp
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const sendUserIdentificationOTP = async (req, res, next) => {

    try{

        const { emailOrPhone } = req.body;

        if(isEmail(emailOrPhone)){

            const userEmail = await userModel.findOne({email : emailOrPhone});

            if(!userEmail){
                return next(createError(400, "User not found!"));
            }
    
            // create access token
            let activationCode = getRandomCode(100000, 999999);
    
            // check activation code
            const checkActivationCode = await userModel.findOne({accessToken : activationCode});
    
            if( checkActivationCode ){
                activationCode = getRandomCode(100000, 999999);
            }
    
            if(userEmail){
    
                const activationToken  = createToken({id : userEmail._id}, '30d');
        
                sendActivationLink(userEmail.email, {
                    name : userEmail.firstName + ' ' + userEmail.surName,
                    link : `${process.env.APP_URI + ':' + process.env.SERVER_PORT}/api/v1/user/activate/${activationToken}`,
                    code : activationCode
                });
    
                await userModel.findByIdAndUpdate(userEmail._id, {
                    accessToken : activationCode
                });
                
                return res.status(200).cookie('otp', userEmail.email, {
                    expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                }).json({
                    message : "User forgot password link send to your account! Check your email."
                });
    
            }

        }else if(isPhone(emailOrPhone)){

            const userPhone = await userModel.findOne({phone : emailOrPhone});

            if(!userPhone){
                return next(createError(400, "Invalid phone No.!"))
            }
    
            // create access token
            let activationCode = getRandomCode(100000, 999999);
    
            // check activation code
            const checkActivationCode = await userModel.findOne({accessToken : activationCode});
    
            if( checkActivationCode ){
                activationCode = getRandomCode(100000, 999999);
            }
    
            if(userPhone){
        
                // sendSms(userPhone.phone, `Your OTP code is ${activationCode}`);
    
                await userModel.findByIdAndUpdate(userPhone._id, {
                    accessToken : activationCode
                });
                
                return res.status(200).cookie('otp', userPhone.phone, {
                    expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                }).json({
                    message : "User forgot password OTP send to your phone number! Check your message!"
                });
    
            }

        }else{
            return next(createError(400, "Invalid phone or email address!"));
        }

    }catch(err){
        return next(err);
    }

}

/**
 * check password reset OTP
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const checkPasswordResetOTP = async (req, res, next) => {

    try{

        const { phoneOrEmail, code } = req.body;

        if(isEmail(phoneOrEmail)){

            const emailUser = await userModel.findOne().where("email").equals(phoneOrEmail);
            
            if(!emailUser){
                return next(createError(400, "Invalid email address!"));
            }

            if(emailUser){

                if(emailUser.accessToken != code){
                    return next(createError(400, "Invalid OTP code!"));
                }

                if(emailUser.accessToken == code){
                    return res.status(200).cookie('changePassID', emailUser._id.toString(), {
                        expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                    }).cookie('changePassCode', code, {
                        expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                    }).json({
                        message : "You can change your password!"
                    });
                }

            }

        }else if(isPhone(phoneOrEmail)){

            const phoneUser = await userModel.findOne().where("phone").equals(phoneOrEmail);
            
            if(!phoneUser){
                return next(createError(400, "Invalid phone number!"));
            }

            if(phoneUser){

                if(phoneUser.accessToken != code){
                    return next(createError(400, "Invalid OTP code!"));
                }

                if(phoneUser.accessToken == code){
                    return res.status(200).cookie('changePass', phoneUser._id.toString(), {
                        expires : new Date(Date.now() + 1000 * 60 * 60 * 72)
                    }).json({
                        message : "You can change your password!"
                    });
                }

            }

        }else{
            return next(createError(400, "Invalid phone number or email address!"));
        }

    }catch(err){
        next(err);
    }

}

/**
 * password reset
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const passwordReset = async (req, res, next) => {

    try{

        const {id, password, code} = req.body;

        const userData = await userModel.findOne().and([
            {_id : id}, 
            {accessToken : code}
        ]);

        if(!userData){
            next(400, "Password change request failed!");
        }

        if(userData){

            await userModel.findByIdAndUpdate(userData._id, {
                password : genHashPassword(password),
                accessToken : ""
            });

            return res.status(200).clearCookie("changePassID").clearCookie("changePassCode").clearCookie("otp").clearCookie("findUser").json({
                message : "Password changed successfull!"
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

export const userUpdateProfile = async (req, res, next) => {

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
 * user profile photo update
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const userProfilePhotoUpdate = async (req, res, next) => {
    try{

        const {id} = req.params;

        const userUpdate = await userModel.findByIdAndUpdate(id, {avatar : req.file.filename}, { new : true });

        
        if(!userUpdate){
            return next(createError(400, "Profile photo update failed!"));
        }

        if(userUpdate){
            return res.status(200).json({
                message : "Profile photo updated successfull!",
                filename : req.file.filename
            });
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

export const userLogout = async (req, res, next) => {
    try{

        res.clearCookie("authToken");
        res.status(200).json({
            message : "Logout successfully complete!"
        });

    }catch(err){
        return next(err);
    }
}


