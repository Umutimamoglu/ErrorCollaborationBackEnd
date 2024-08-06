import mongoose from "mongoose";

const connectToDatabase = async () => {
    const uri = process.env.ATLAS_URI;
    if (!uri) {
        throw new Error("MongoDB URI is not defined in the environment variables.");
    }

    try {
        await mongoose.connect(uri);
        console.log("Connection established");
    } catch (error) {
        console.error("Error in connectToDatabase:", error);
        throw error;
    }
}

export default connectToDatabase;
