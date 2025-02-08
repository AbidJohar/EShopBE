import mongoose from "mongoose";


const connectToDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB is connected");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/ESHOP`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

export default connectToDB;