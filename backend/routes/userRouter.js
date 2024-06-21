import express from "express";
import { getLoginUser, userActivation, userLogin, userSignup } from "../controllers/userController.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
import upload from "../middlewares/multer.js";


// user routes
router.post('/user-signup', userSignup);
router.post('/activation', catchAsyncErrors(userActivation));
router.post('/user-login', catchAsyncErrors(userLogin));
router.get('/get-login-user', isAuthenticated, catchAsyncErrors(getLoginUser));

export default router;
