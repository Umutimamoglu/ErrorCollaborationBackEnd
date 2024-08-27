import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/userModel";
import validator from "validator";
import { IUser } from "../types";
import { AuthRequest } from "../middleware ";

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
        const { name, email, password, image, positionTitle } = request.body;

        if (!name || !email || !password || !image || !positionTitle) {
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
            password: await bcrypt.hash(password, salt),
            image,
            positionTitle
        });

        await user.save();
        const token = getUserToken(user._id);

        return response.status(201).json({ _id: user._id, name, token, image });
    } catch (error) {
        console.error("Error in createUser", error);
        return response.status(500).json({ message: "Server error", error });
    }
};


export const loginUser = async (request: Request, response: Response) => {
    try {
        const { email, password }: IUser = request.body;
        console.log("Gelen istek verileri:", request.body); // Gelen verileri kontrol edin
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("E-posta için kullanıcı bulunamadı:", email);
            return response.status(409).send({ message: "Kullanıcı bulunamadı" });
        }

        const isPasswordIdentical = await bcrypt.compare(password, existingUser.password);
        if (isPasswordIdentical) {
            const token = getUserToken(existingUser._id);
            console.log("Kullanıcı başarıyla kimlik doğruladı:", email);
            return response.send({
                token,
                user: {
                    _id: existingUser._id, // MongoDB ObjectId'sini burada döndürüyoruz
                    email: existingUser.email,
                    name: existingUser.name,
                    image: existingUser.image, // Image alanını ekledik
                    positionTitle: existingUser.positionTitle, // PositionTitle alanını ekledik
                },
            });
        } else {
            console.log("Yanlış şifre için e-posta:", email);
            return response.status(400).send({ message: "Yanlış kimlik bilgileri" });
        }
    } catch (error) {
        console.log('loginUser Hatası:', error);
        response.status(500).send({ message: "Sunucu hatası" });
    }
};

export const updateUser = async (request: AuthRequest, response: Response) => {
    try {
        const { name, email, password } = request.body;
        const image = request.file ? request.file.path : null;

        if (!name || !email || !password || !image) {
            return response.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return response.status(400).json({ message: "Email must be a valid email" });
        }
        //
        console.log("Uploaded file:", request.file);
        console.log("Request body:", request.body);
        //
        let user = await User.findOne({ email });
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        user.name = name;
        user.password = await bcrypt.hash(password, salt);
        user.image = image;

        await user.save();
        const token = getUserToken(user._id);

        return response.status(200).json({ _id: user._id, name, token, image });
    } catch (error) {
        console.error("Error in updateUser", error);
        return response.status(500).json({ message: "Server error", error });
    }
};