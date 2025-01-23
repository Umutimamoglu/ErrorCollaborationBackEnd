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
        // Body'den gelen veriler ve varsayılan değerler
        const {
            name,
            email,
            password,
            image = "https://example.com/default-profile.png", // Varsayılan profil resmi URL'si
            positionTitle = "Unspecified Position" // Varsayılan pozisyon başlığı
        } = request.body;

        // Zorunlu alanların kontrolü
        if (!name || !email || !password) {
            return response.status(400).json({ message: "Name, email, and password are required" });
        }

        // Email doğrulama
        if (!validator.isEmail(email)) {
            return response.status(400).json({ message: "Email must be a valid email" });
        }

        // Kullanıcının zaten var olup olmadığını kontrol et
        let user = await User.findOne({ email });
        if (user) {
            return response.status(409).json({ message: "User already exists" });
        }

        // Şifreyi hashleme
        const salt = await bcrypt.genSalt(10);
        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, salt),
            image,
            positionTitle
        });

        // Kullanıcıyı kaydet
        await user.save();

        // JWT oluştur ve yanıtla
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
        const { name, email, positionTitle } = request.body;  //
        const image = request.file ? request.file.path : null;



        if (!name || !email || !image) {
            return response.status(400).json({ message: "İsim, e-posta ve resim alanları zorunludur" });
        }


        if (!validator.isEmail(email)) {
            return response.status(400).json({ message: "Geçerli bir e-posta adresi girin" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return response.status(404).json({ message: "Kullanıcı bulunamadı" });
        }


        user.name = name;
        user.positionTitle = positionTitle;
        user.image = image;


        if (request.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(request.body.password, salt);
        }

        await user.save();

        return response.status(200).json({ _id: user._id, name, image: user.image, positionTitle });
    } catch (error) {
        console.error("updateUser fonksiyonunda hata oluştu", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
};

export const getUserById = async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;


        const user = await User.findById(userId).select('-password');
        if (!user) {
            return response.status(404).json({ message: "Kullanıcı bulunamadı" });
        }


        return response.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            positionTitle: user.positionTitle
        });


    } catch (error) {
        console.error("getUserById fonksiyonunda hata oluştu", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
};