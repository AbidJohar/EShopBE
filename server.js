import express from 'express';
import cors from 'cors';  
import connectToDB from './config/dbConnection.js';   
import connectCloudinary from './config/cloudinary.js';   
import 'dotenv/config';  // Load environment variables
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

// -------( App Config )--------
app.use(express.json());   
app.use(cors());   

// Database and Cloudinary connections
connectToDB();
connectCloudinary();

 

// API Endpoints
app.use('/api/v1/users', userRouter);   
app.use('/api/v1/products', productRouter);   
app.use('/api/v1/carts', cartRouter);   
app.use('/api/v1/orders', orderRouter);   



// -------( Server Setup )--------
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on Port: ${port}`);
});
