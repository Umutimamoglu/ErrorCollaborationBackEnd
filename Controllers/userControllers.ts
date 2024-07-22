import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/index';
import dotenv from 'dotenv';
import User from "../models/userModel";
import validator from "validator";
import { error } from "console";

dotenv.config();

/**
 * Kullanıcının JWT'sini oluşturan fonksiyon.
 * @param _id Kullanıcının MongoDB ObjectId'si.
 * @returns Oluşturulan JWT.
 */
const getUserToken = (_id: Types.ObjectId) => {
    const jwt_key = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwt_key, { expiresIn: "7d" });
};

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return response.status(400).json({ message: "Email must be a valid email" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return response.status(409).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, salt)
        });

        await user.save();
        const token = getUserToken(user._id);

        return response.status(201).json({ _id: user._id, name, token });
    } catch (error) {
        console.error("Error in createUser", error);
        return response.status(500).json({ message: "Server error", error });
    }
};


export const loginUser = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;
        let user = await User.findOne({ email });

        if (!user) {
            return response.status(400).json("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return response.status(400).json("Invalid email or password");
        }

        const token = getUserToken(user._id);

        response.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.error("loginUser Error:", error);
        response.status(500).json("Server error");
    }
};