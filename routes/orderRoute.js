import express from 'express';
import { orderThroughCOD,orderThroughRazorpay,getAllProducts,updateOrders,userOrders } from '../controller/orderControllers.js';
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js';
const orderRouter = express.Router();

// For admin
orderRouter.post('/list',adminAuth, getAllProducts);
orderRouter.post('/status',adminAuth, updateOrders);

// For user
orderRouter.post('/cash-on-delivery',authUser, orderThroughCOD);
orderRouter.post('/razorpay',authUser,orderThroughRazorpay);
orderRouter.post('/userOrders',authUser,userOrders);

export default orderRouter;