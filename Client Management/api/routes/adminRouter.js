import express from 'express';
import multer, { diskStorage } from 'multer';
import path from "path";
import { adminLogin, adminLogout, adminSignup, adminUpdateProfile, loggedInAdmin } from '../controllers/adminController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { addNewClient, addNewOrder, deleteClient, deleteOrder, getAllClient, getAllOrder, getAllOrderByClient, getSingleOrder, updateClient, updateOrder } from '../controllers/orderController.js';
const router = express.Router();

const __dirname = path.resolve();

const storage = diskStorage({
    destination : (req, file, cb) => {
        if(file.fieldname === "featuredImage"){
            cb(null, path.join(__dirname, "/api/public/featured-image"));
        }else if(file.fieldname === "profilePhoto"){
            cb(null, path.join(__dirname, "/api/public/profile-photo"));
        }
    },

    filename : (req, file, cb) => {
        cb(null, ((Date.now() / 1000) / 60) + "-" + file.originalname);
    }
});


// admin router
router.post('/admin-signup', adminSignup);
router.post('/admin-login', adminLogin);
router.get('/me', adminMiddleware, loggedInAdmin);
router.put('/admin-profile-update/:id', adminMiddleware, adminUpdateProfile);
router.post('/admin-logout', adminMiddleware, adminLogout);

// client router
router.post('/add-new-client', adminMiddleware, addNewClient);
router.get('/all-client', adminMiddleware, getAllClient);
router.patch('/clients/:id', adminMiddleware, updateClient);
router.delete('/clients/:id', adminMiddleware, deleteClient);

// order router
router.post('/client/add-new-order', adminMiddleware, addNewOrder);
router.get('/client/all-order', adminMiddleware, getAllOrder);
router.get('/client/orders/:id', adminMiddleware, getSingleOrder);
router.get('/client/all-orders/:id', adminMiddleware, getAllOrderByClient);
router.patch('/client/orders/:id', adminMiddleware, updateOrder);
router.delete('/client/orders/:id', adminMiddleware, deleteOrder);


// router export
export default router;
