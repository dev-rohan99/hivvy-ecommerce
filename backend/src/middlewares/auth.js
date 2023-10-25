import jwt from "jsonwebtoken";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../utilities/errorHandler.js";
import userModel from "../models/userModel.js";


export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new errorHandler("Please login to continue", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    req.user = await userModel.findById(decoded.id);
    next();
});
