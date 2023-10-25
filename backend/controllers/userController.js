import userModel from "../models/userModel.js";
import errorHandler from "../utilities/errorHandler.js";
import fs from "fs";
import { createActivationToken, sendToken, verifyActivationToken } from "../utilities/token.js";
import sendEmail from "../utilities/sendEmail.js";
import cloudinary from "cloudinary";


/**
 * user signup controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const userSignup = async (req, res, next) => {
    try{
        const { name, email, password, avatar } = req.body;
        console.log("hello");
        const userEmail = await userModel.findOne({email: email});
        if(userEmail){
            return next(new errorHandler("This user already exist! Please try with another email.", 400))
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars"
        });
        // const filename = req.file.filename;
        // const fileUrl = path.join(filename);
        const user = {
            ...req.body,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        };
        const activationToken = createActivationToken(user);
        const activationUrl = `http://localhost:5173/activation/${activationToken}`;

        try{

            await sendEmail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });

            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account!`
            });

        }catch(err){
            return next(new errorHandler(err.message, 400));
        }

    }catch(err){
        return next(new errorHandler(err.message, 400));
    }
}

/**
 * user activation controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const userActivation = async (req, res, next) => {
    try{

        const { activationToken } = req.body;
        const newUser = verifyActivationToken(activationToken);

        if(!newUser){
            return next(new errorHandler("Invalid token", 400));
        }

        const { name, email, password, avatar } = newUser;
        const findUser = await userModel.findOne({ email });

        if(findUser){
            return next(new errorHandler("This user already exists!", 400));
        }

        const user = await userModel.create({
            ...newUser
        });

        sendToken(user, 201, res);

    }catch(err){
        return next(new errorHandler(err.message, 400));
    }
}

/**
 * user login controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const userLogin = async (req, res, next) => {
    try{

        const { email, password } = req.body;

        if(!email || !password){
            return next(new errorHandler("Please provide the all fields!", 400));
        }

        const user = await userModel.findOne({ email });

        if(!user){
            return next(new errorHandler("User doesn't exists!", 400));
        }

        const isPasswordValid = await user.comparePassword(password);
        
        if(!isPasswordValid){
            return next(new errorHandler("Please provide the correct information", 400));
        }

        sendToken(user, 201, res);

    }catch(err){
        return next(new errorHandler(err.message, 400));
    }
}

/**
 * get login user controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

export const getLoginUser = async (req, res, next) => {
    try{

        const user = await userModel.findById(req.user.id);

        if(!user){
            return next(new errorHandler("User doesn't exists", 400));
        }

        res.status(200).json({
            success: true,
            user,
        });

    }catch(err){
        return next(new errorHandler(err.message, 400));
    }
}

