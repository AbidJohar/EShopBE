import express from 'express'
import { getUserCart, updateCart, addToCart} from '../controller/cartControllers.js';
import authUser from '../middleware/auth.js';

const cartRouter = express.Router();


cartRouter.post('/get', authUser, getUserCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/add', authUser, addToCart);

export default cartRouter;