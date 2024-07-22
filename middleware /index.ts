import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/userModel";

export interface AuthRequest extends Request {
    userId: string;  // Only store the user's ID
}

export const authenticationMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.log("Authorization header missing or malformed");
            return response.status(401).json({ error: "Authorization required" });
        }

        const token = authorization.split(' ')[1]; // Assuming it's a 'Bearer token'
        const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY || "fallback_secret_key"); // Use the secret key from .env or fallback
        const existingUser = await User.findById(_id);

        if (existingUser) {

            request.userId = existingUser._id.toString();  // Convert ObjectId to string if necessary
            next();
        } else {
            console.log("User not found");
            response.status(401).json({ error: "Invalid token" });
        }
    } catch (error) {
        console.log("Error in authenticationMiddleware:", error);
        response.status(500).json({ error: "Authentication error", detailedError: error.message });
    }
};