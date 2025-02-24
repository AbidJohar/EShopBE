import orderModel from '../model/orderModel.js';
import productModel from '../model/productModel.js';
import userModel from '../model/userModel.js';
// function to order the products through cash on delivery
const orderThroughCOD = async (req,res)=>{
try {
    const {userId, item, address, amount} = req.body;
     console.log("user id", userId);
     console.log("address", address);
     
    if (!userId || !item || !address || amount === undefined || amount < 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid input data",
        });
    }

    const orderData = {
        userId,
        item,
        address,
        amount,
        paymentMethod:'COD',
        payment: false,
        date: Date.now()
    } 
    console.log("orde data:",orderData);
    

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, {orderData:{}});

return res.json({
        success: true,
        message: "Order placed"
    })

} catch (error) {
    console.log("Error from orderThroughCOD",error);
 return res.json({
        success: false,
        message: error.message
    })
    
}

}
// function to order the products through Razorpay method
const orderThroughRazorpay = async (req,res)=>{



}
// get all products for admin panel
const getAllProducts = async (req,res)=>{

}
// get user orders function
const userOrders = async (req,res)=>{

    try {
        const {userId} = req.body;
        
        const allproducts = await productModel.findById({userId});



    } catch (error) {
        
    }



}
// update orders function
const updateOrders = async (req,res)=>{

}
export { orderThroughCOD, orderThroughRazorpay,getAllProducts,userOrders,updateOrders};