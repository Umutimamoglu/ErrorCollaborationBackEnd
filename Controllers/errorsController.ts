import { Response } from "express";
import { IError } from '../types/index';
import ErrorM from "../models/errorModel";
import { AuthRequest } from "../middleware ";


export const createError = async (request: AuthRequest, response: Response) => {
    try {
        const { color, name, isFixed, language, type }: IError = request.body;
        const image = request.file ? request.file.path : null; // Yüklenen dosyanın yolu

        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }

        if (!name || !color || !language || !type) {
            return response.status(400).json({ message: "Required fields are missing." });
        }

        const newError = await ErrorM.create({
            user: request.userId,
            name,
            isFixed: isFixed || false,
            image,
            color,
            language,
            type,
        });

        response.status(201).json(newError);
    } catch (error) {
        console.error("Error in createError:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};