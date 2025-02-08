import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   
    trim: true        
  },
  price: {
    type: Number,
    required: true,   
    min: 0            
  },
  description: {
    type: String,
    required: true,   
    trim: true        
  },
  image: {
    type: Array,     
    required: true   
  },
  category: {
    type: String,
    required: true   
  },
  sizes:{
    type:Array,
    required:true
  },
  bestSeller:{
    type:Boolean
  },
 date:{
    type:Number,
    required:true
 }
});

// Create a model from the schema
const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
