import mongoose from "mongoose";
require("dotenv").config();

const uri = process.env.ATLAS_URI;


if (!uri) {
    throw new Error("MongoDB URI is not defined in the environment variables.");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connection established");
    } catch (error) {
        console.error("Error in connectToDatabase:", error);
        throw error;
    }
}

export default connectToDatabase;