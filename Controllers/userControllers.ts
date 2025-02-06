import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel";
import { IUser } from "../types";
import { AuthRequest } from "../middleware ";

dotenv.config();

/**
 * Kullanıcının JWT'sini oluşturan fonksiyon.
 * @param _id Kullanıcının MongoDB ObjectId'si.
 * @returns Oluşturulan JWT.
 */
const getUserToken = (_id: Types.ObjectId) => {
    const jwtKey = process.env.JWT_SECRET_KEY || "DEFAULT_SECRET";
    return jwt.sign({ _id }, jwtKey, { expiresIn: "1y" }); // 1 yıl geçerli token
};

/**
 * Kullanıcı Kaydı (Register)
 */
export const createUser = async (request: Request, response: Response) => {
    try {
        console.log("📩 Gelen Kayıt İsteği:", request.body); // 📌 Gelen JSON verisini logla

        const { name, email, password, image, positionTitle } = request.body;

        // 1) Gerekli alanları kontrol et
        if (!name || !email || !password) {
            return response.status(400).json({ message: "Name, email, and password are required" });
        }

        // 2) Email formatı kontrol et
        if (!validator.isEmail(email)) {
            return response.status(400).json({ message: "Email must be a valid email" });
        }

        // 3) Kullanıcının zaten var olup olmadığını kontrol et
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).json({ message: "User already exists" });
        }

        // 4) Şifreyi hashleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5) Yeni kullanıcı oluştur
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: image || "https://example.com/default-profile.png",
            positionTitle: positionTitle || "Unspecified Position",
        });

        // 6) Kullanıcıyı kaydet
        await newUser.save();
        console.log("✅ Yeni kullanıcı başarıyla kaydedildi:", newUser);

        // 7) JWT oluştur ve yanıtla
        const token = getUserToken(newUser._id);
        return response.status(201).json({
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                image: newUser.image,
                positionTitle: newUser.positionTitle,
            },
        });
    } catch (error) {
        console.error("❌ Hata - createUser fonksiyonu:", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
};

/**
 * Kullanıcı Girişi (Login)
 */
export const loginUser = async (request: Request, response: Response) => {
    try {
        console.log("📩 Gelen Giriş İsteği:", request.body); // 📌 Gelen JSON verisini logla

        const { email, password }: IUser = request.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            console.log("🚨 Kullanıcı bulunamadı:", email);
            return response.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log("🚨 Yanlış şifre için giriş denemesi:", email);
            return response.status(400).json({ message: "Yanlış şifre" });
        }

        const token = getUserToken(existingUser._id);
        console.log("✅ Kullanıcı başarıyla giriş yaptı:", existingUser.email);

        return response.json({
            token,
            user: {
                _id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                image: existingUser.image,
                positionTitle: existingUser.positionTitle,
            },
        });
    } catch (error) {
        console.error("❌ loginUser Hatası:", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
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