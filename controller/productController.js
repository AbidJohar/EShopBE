import productModel from "../model/productModel.js";
import {v2 as cloudinary} from 'cloudinary';


const addProduct = async (req, res) => {
    try {
        const { name, price, description, category, sizes, bestSeller} = req.body;
        
        // console.log("req file:",req.files);
         
        
        // Check if req.files exists
        if (!req.files) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined); // Remove undefined
                  
        if (images.length === 0) {
            return res.status(400).json({ error: "No valid images uploaded" });
        }
        //    console.log("before upload on cloudinary");
           
        // Upload images to Cloudinary
        const imageUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    const result = await cloudinary.uploader.upload(item.path, {
                        resource_type: 'image',
                        quality: 'auto:low',  // Optimize quality
                        format: 'webp',       // Convert to WebP for smaller size
                        width: 800,           // Resize for speed
                        crop: 'limit'         // Prevent excessive upscaling
                    });
                    return result.secure_url;
                } catch (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return null; // Prevents failure if one upload fails
                }
            })
        );
         
         
        const product = new productModel({
            name,
            description,
            price: Number(price),
            sizes: JSON.parse(sizes),
            category,
            bestSeller: bestSeller === 'true' ? true : false,
            image: imageUrl,
            date: Date.now()
        })
        await product.save();

        return res.status(200).json({ success: true, message: "Product added successfully", product});

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
        
            


const removeProduct = async (req, res) => {
    try {
        const { id } = req.query;  
        
        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({success:true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const listProduct = async (_,res) => {
  try {

    const allproducts = await productModel.find({});
      return res.status(200).json({success: true, products: allproducts})
    
  } catch (error) {
     console.error("Erro in list Product function:",error);
     
  }

}
const singleProductInfo = async (req, res) => {
    try {
        const id = req.query;  
        
        const product = await productModel.findById(id); // Fetch the product by ID

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export {addProduct,removeProduct,listProduct,singleProductInfo}