import userModel from "../model/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
       console.log("userid", userId);
       console.log("itemid", itemId);
       
    // Fetch user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData; // Ensure cartData exists

    // Update the cart logic
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1; // Increase quantity
      } else {
        cartData[itemId][size] = 1; // Add size for the item
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Save the updated cartData to the database
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    return res.json({
      success: true,
      message: "Added to cart",
    });
  } catch (error) {
    console.log("Error in addToCart func:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);

    let cartData = userData.cartData;

    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    return res.json({
      success: true,
      message: "cart Updated",
    });
  } catch (error) {
    console.log("Error in updatecart func:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
const getUserCart = async (req, res) => {

 try {

  const {userId} = req.body;

  const userData = await userModel.findById(userId);

    const cartData = userData.cartData;

    return res.status(200).json({
        success:true,
        data:cartData
    })


    
 } catch (error) {
    console.log("Error in getusercart func:", error);
    return res.json({
      success: false,
      message: error.message,
    });
 }

};

export { addToCart, getUserCart, updateCart };
