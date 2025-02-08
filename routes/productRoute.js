import express from 'express';
import { addProduct, listProduct, removeProduct, singleProductInfo } from '../controller/productController.js';
import upload from '../middleware/multer.js';
import adminAuthMiddleware from '../middleware/adminAuth.js';

const productRouter = express.Router();


productRouter.post('/add-product',adminAuthMiddleware,upload.fields([
    {name: 'image1', maxCount: 1},
    {name: 'image2', maxCount: 1},
    {name: 'image3', maxCount: 1},
    {name: 'image4', maxCount: 1}
]), addProduct);
productRouter.post('/remove-product', removeProduct);
productRouter.get('/list-product', listProduct);
productRouter.post('/single-productInfo', singleProductInfo);

export default productRouter;