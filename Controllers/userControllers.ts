import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/index';
import dotenv from 'dotenv';
import User from "../models/userModel";
import validator from "validator"; // Düzeltildi

dotenv.config();

/**
 * Kullanıcının JWT'sini oluşturan fonksiyon.
 * @param _id Kullanıcının MongoDB ObjectId'si.
 * @returns Oluşturulan JWT.
 */
const getUserToken = (_id: Types.ObjectId) => {
    const jwtKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key';
    return jwt.sign({ _id: _id.toString() }, jwtKey, { expiresIn: "3d" });
};

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password)
            return response.status(400).json({ message: "All fields are required" });
        if (!validator.isEmail(email))
            return response.status(400).json({ message: "Email must be a valid email" });

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


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log("Invalid password for user:", email);
            return res.status(400).json("Invalid email or password");
        }

        const token = getUserToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
};

