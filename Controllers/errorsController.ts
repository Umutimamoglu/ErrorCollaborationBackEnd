import { Response } from "express";
import { IError } from '../types/index';
import ErrorM from "../models/errorModel";
import { AuthRequest } from "../middleware ";


export const createError = async (request: AuthRequest, response: Response) => {
    try {
        const { color, name, isFixed, language, type, howDidIFix }: IError = request.body;
        const image = request.file ? request.file.path : null; // Yüklenen dosyanın yolu

        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }

        if (!name || !color || !language || !type || !howDidIFix) {
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
            howDidIFix,
        });

        response.status(201).json(newError);
    } catch (error) {
        console.error("Error in createError:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


export const getMyBugs = async (request: AuthRequest, response: Response) => {
    try {
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }

        const userErrors = await ErrorM.find({ user: request.userId });

        if (!userErrors) {
            return response.status(404).json({ message: "No errors found for this user." });
        }

        response.status(200).json(userErrors);
    } catch (error) {
        console.error("Error in getMyBugs:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const getAllBugs = async (request: AuthRequest, response: Response) => {
    try {

        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }


        const allErrors = await ErrorM.find().populate('user', 'name email');



        if (!allErrors || allErrors.length === 0) {
            return response.status(404).json({ message: "No errors found." });
        }


        response.status(200).json(allErrors);
    } catch (error) {
        console.error("Error in getAllBugs:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
