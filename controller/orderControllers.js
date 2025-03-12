import orderModel from '../model/orderModel.js'
import userModel from '../model/userModel.js';
 // function to order the products through cash on delivery
const orderThroughCOD = async (req,res)=>{
try {
    const {userId, item, address, amount} = req.body;
    //  console.log("user id", userId);
    //  console.log("address", address);
     
    if ( !item || !address ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }
    if ( amount === undefined || amount < 0 ) {
        return res.status(400).json({
            success: false,
            message: "Invalid data",
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
// get all orders for admin panel
const getAllOrders = async (req,res)=>{

    try {
       const allOrders = await orderModel.find({});

       return res.json({
        success: true,
        allOrders
       }); 
    } catch (error) {
       console.log("Error in getAllOrders func:",error);
        
    }

}
// get user orders function
const userOrders = async (req,res)=>{

    try {
        const {userId} = req.body;
        
        const orders = await orderModel.find({userId});

        return res.json({
            success: true,
            orders
        })


    } catch (error) {
         console.log("Error in userOrders func:",error);
         
    }

}
// update orders function
const updateOrders = async (req,res)=>{

    try {
        const {orderId, status} = req.body;
        console.log("orderId:",orderId);
        console.log("status:",status);
        

        await orderModel.findByIdAndUpdate(orderId, {status});

        return res.json({
            success:true,
            message:"status updated"
        })        
    } catch (error) {
        console.log("Error in updateOrders:",error);
        
    }



}
export { orderThroughCOD, orderThroughRazorpay,getAllOrders,userOrders,updateOrders};