import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/userModel";

export interface AuthRequest extends Request {
    file: any;
    userId: string;
}
export const authenticationMiddleware = async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.log("Authorization header missing or malformed:", authorization); // Gelen header'ı loglayın
            return response.status(401).json({ error: "Authorization required" });
        }

        const token = authorization.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || "fallback_secret_key");
        console.log("Decoded Token:", decodedToken); // Token içeriğini loglayın

        const { _id } = decodedToken as { _id: string };

        const existingUser = await User.findById(_id);
        if (existingUser) {
            request.userId = existingUser._id.toString();
            next();
        } else {
            console.log("User not found for token:", _id);
            return response.status(401).json({ error: "Invalid token" });
        }
    } catch (error) {
        console.log("Error in authenticationMiddleware:", error);
        if (error instanceof jwt.TokenExpiredError) {
            return response.status(401).json({ error: "Token has expired", detailedError: error.message });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json({ error: "Invalid token", detailedError: error.message });
        } else {
            return response.status(500).json({ error: "Authentication error", detailedError: error.message });
        }
    }
};