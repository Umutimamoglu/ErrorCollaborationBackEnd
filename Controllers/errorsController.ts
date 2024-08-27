import { Response } from "express";
import { IError } from '../types/index';
import ErrorM from "../models/errorModel";
import { AuthRequest } from "../middleware ";
import favoritesModel from "../models/favoritesModel";


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

        const newError = await favoritesModel.create({
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
export const updateError = async (request: AuthRequest, response: Response) => {
    try {
        const { id } = request.params; // ID, URL parametresinden alınır
        const { color, name, isFixed, language, type, howDidIFix }: Partial<IError> = request.body;
        const image = request.file ? request.file.path : undefined;

        if (!request.userId) {
            return response.status(401).json({ message: "User not authenticated." });
        }

        const updateFields: Partial<IError> = {};
        if (color) updateFields.color = color;
        if (name) updateFields.name = name;
        if (typeof isFixed !== 'undefined') updateFields.isFixed = isFixed;
        if (language) updateFields.language = language;
        if (type) updateFields.type = type;
        if (howDidIFix) updateFields.howDidIFix = howDidIFix;
        if (image) updateFields.image = image;

        const updatedError = await ErrorM.findOneAndUpdate(
            { _id: id, user: request.userId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedError) {
            return response.status(404).json({ message: "Error not found or not authorized to update." });
        }

        response.status(200).json(updatedError);
    } catch (error) {
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};



export const deleteError = async (request: AuthRequest, response: Response) => {
    try {
        const { id } = request.params;

        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }

        const error = await ErrorM.findOneAndDelete({ _id: id, user: request.userId });

        if (!error) {
            return response.status(404).json({ message: "Error not found or not authorized to delete." });
        }

        response.status(200).json({ message: "Error deleted successfully.", error });
    } catch (error) {
        console.error("Error in deleteError:", error);
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

        const allErrors = await ErrorM.find().populate('user', 'name email');

        response.status(200).json(allErrors);
    } catch (error) {
        console.error("Error in getAllBugs:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


export const addToFavorites = async (request: AuthRequest, response: Response) => {
    try {
        const { color, name, isFixed, language, type, howDidIFix }: IError = request.body;
        const image = request.file ? request.file.path : null;

        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }

        if (!name || !color || !language || !type || !howDidIFix) {
            return response.status(400).json({ message: "Required fields are missing." });
        }

        const addFavori = await favoritesModel.create({
            user: request.userId,
            name,
            isFixed: isFixed || false,
            image,
            color,
            language,
            type,
            howDidIFix,
        });

        response.status(201).json(addFavori);
    } catch (error) {
        console.error("Error in createError:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const getAllFavori = async (request: AuthRequest, response: Response) => {
    try {
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }

        // Fetch user's favorite errors and populate the user field
        const userErrors = await favoritesModel.find({ user: request.userId }).populate('user');

        if (!userErrors || userErrors.length === 0) {
            return response.status(404).json({ message: "No errors found for this user." });
        }

        response.status(200).json(userErrors);
    } catch (error) {
        console.error("Error in getAllFavori:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
};