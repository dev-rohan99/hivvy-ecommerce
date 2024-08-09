import jwt from "jsonwebtoken";
import createError from "../utility/createError.js";

export const adminMiddleware = (req, res, next) => {

    try {
        const token = req.cookies.authToken;

        // Token check
        if (!token) {
            console.log("No token found in cookies");
            return next(createError(401, 'Sorry! You are not authorized!'));
        }

        jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, loginUser) => {
 
            if (err) {
                console.error("Error verifying token:", err);
                return next(createError(401, 'Invalid token!'));
            }

            if (!loginUser) {
                console.error("No user found after token verification");
                return next(createError(401, 'Invalid token!'));
            }

            // if (loginUser.admin._id !== req.params.id) {
            //     console.log("User ID does not match");
            //     return next(createError(401, 'You are not authorized to access this feature!'));
            // }

            if (loginUser.admin.role !== "admin") {
                console.log("User is not an admin");
                return next(createError(401, 'Sorry, you are not able to access this feature! This feature is only accessible for admin. Please reach out to admin and discuss your problems.'));
            }
            req.adminId = loginUser.admin._id;
            req.role = loginUser.admin.role;
            req.username = loginUser.admin.username;
            next();
        });

    } catch (err) {
        console.error("Unexpected error in admin middleware:", err);
        next(createError(500, 'An unexpected error occurred!'));
    }

}


