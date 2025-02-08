import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   
    trim: true        
  },
  email: {
    type: String,
    required: true,   
    unique: true,     
    lowercase: true,   
  },
  password: {
    type: String,
    required: true,    
  },
  cartData:{
    type:Object,
    default: {}
  },
   
},{minimize:false, timestamps:true} );

// Create a model from the schema
const userModel = mongoose.models.User ||  mongoose.model("User", userSchema);

export default userModel;
