import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel";

import { IUser } from "../types";
import { OTP } from "../models/otpModel";

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
 * Kullanıcı Kaydı (Register) - OTP ile doğrulama
 */
export const createUser = async (request: Request, response: Response) => {
    try {
        console.log("📩 Gelen Kayıt İsteği:", request.body);

        const {
            name,
            email,
            password,
            image,
            positionTitle,
            fixedBugsCount,
            experience,
            country,
            pushNotificationToken,
            otp // OTP alanı eklendi
        } = request.body;

        // 1) Zorunlu alan kontrolü (OTP dahil)
        if (!name || !email || !password || !otp) {
            return response.status(400).json({
                success: false,
                message: "Name, email, password ve OTP zorunludur"
            });
        }

        // 2) Email geçerli mi?
        if (!validator.isEmail(email)) {
            return response.status(400).json({
                success: false,
                message: "Geçerli bir email adresi girin"
            });
        }

        // 3) Kullanıcı zaten kayıtlı mı?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).json({
                success: false,
                message: "Bu email adresi ile zaten kayıtlı bir kullanıcı var"
            });
        }

        // 4) OTP Doğrulaması - En son gönderilen OTP'yi bul
        const otpResponse = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (otpResponse.length === 0) {
            return response.status(400).json({
                success: false,
                message: 'OTP bulunamadı. Lütfen yeni bir OTP talep edin',
            });
        }

        if (otp !== otpResponse[0].otp) {
            return response.status(400).json({
                success: false,
                message: 'Geçersiz OTP kodu',
            });
        }

        // 5) Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6) Yeni kullanıcı oluştur
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: image || "https://example.com/default-profile.png",
            positionTitle: positionTitle || "Unspecified Position",
            fixedBugsCount: fixedBugsCount || "0",
            experience: experience || "Unknown",
            country: country || "Unknown",
            pushNotificationToken: pushNotificationToken || null
        });

        // 7) Veritabanına kaydet
        await newUser.save();

        // 8) Kullanılmış OTP'yi temizle
        await OTP.deleteOne({ _id: otpResponse[0]._id });

        const token = getUserToken(newUser._id);

        return response.status(201).json({
            success: true,
            message: "Kullanıcı başarıyla kaydedildi",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                image: newUser.image,
                positionTitle: newUser.positionTitle,
                fixedBugsCount: newUser.fixedBugsCount,
                experience: newUser.experience,
                country: newUser.country,
                pushNotificationToken: newUser.pushNotificationToken,
            },
        });
    } catch (error) {
        console.error("❌ Hata - createUser fonksiyonu:", error);
        return response.status(500).json({
            success: false,
            message: "Sunucu hatası",
            error
        });
    }
};

/**
 * Kullanıcı Girişi (Login)
 */
export const loginUser = async (request: Request, response: Response) => {
    try {
        const { email, password, pushNotificationToken } = request.body;

        // Zorunlu alan kontrolü
        if (!email || !password) {
            return response.status(400).json({
                success: false,
                message: "Email ve şifre gereklidir"
            });
        }

        // Email formatı kontrolü
        if (!validator.isEmail(email)) {
            return response.status(400).json({
                success: false,
                message: "Geçerli bir email adresi girin"
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return response.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return response.status(400).json({
                success: false,
                message: "Yanlış şifre"
            });
        }

        // Push notification token'ı güncelle
        if (pushNotificationToken) {
            existingUser.pushNotificationToken = pushNotificationToken;
            await existingUser.save();
        }

        const token = getUserToken(existingUser._id);

        return response.json({
            success: true,
            message: "Giriş başarılı",
            token,
            user: {
                _id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                image: existingUser.image,
                positionTitle: existingUser.positionTitle,
                fixedBugsCount: existingUser.fixedBugsCount,
                experience: existingUser.experience,
                country: existingUser.country,
                pushNotificationToken: existingUser.pushNotificationToken
            },
        });
    } catch (error) {
        console.error("❌ loginUser Hatası:", error);
        return response.status(500).json({
            success: false,
            message: "Sunucu hatası",
            error
        });
    }
};

/**
 * Kullanıcı Güncelleme
 */
export const updateUser = async (request: Request, response: Response) => {
    try {
        const {
            _id,
            name,
            email,
            positionTitle,
            fixedBugsCount,
            experience,
            country,
            image,
            password
        } = request.body;

        if (!_id || !name || !email) {
            return response.status(400).json({
                success: false,
                message: "ID, isim ve e-posta zorunludur"
            });
        }

        if (!validator.isEmail(email)) {
            return response.status(400).json({
                success: false,
                message: "Geçerli bir e-posta adresi girin"
            });
        }

        const user = await User.findById(_id);
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        user.name = name;
        user.email = email;
        user.positionTitle = positionTitle || user.positionTitle;
        user.fixedBugsCount = fixedBugsCount || user.fixedBugsCount;
        user.experience = experience || user.experience;
        user.country = country || user.country;
        if (image) user.image = image;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        return response.status(200).json({
            success: true,
            message: "Kullanıcı başarıyla güncellendi",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                positionTitle: user.positionTitle,
                fixedBugsCount: user.fixedBugsCount,
                experience: user.experience,
                country: user.country
            }
        });

    } catch (error) {
        console.error("❌ updateUser hatası:", error);
        return response.status(500).json({
            success: false,
            message: "Sunucu hatası",
            error
        });
    }
};

/**
 * Kullanıcıyı ID ile getir
 */
export const getUserById = async (request: Request, response: Response) => {
    try {
        const { userId } = request.params;

        if (!userId) {
            return response.status(400).json({
                success: false,
                message: "Kullanıcı ID'si gereklidir"
            });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return response.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        return response.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                positionTitle: user.positionTitle,
                fixedBugsCount: user.fixedBugsCount,
                experience: user.experience,
                country: user.country
            }
        });

    } catch (error) {
        console.error("getUserById fonksiyonunda hata oluştu", error);
        return response.status(500).json({
            success: false,
            message: "Sunucu hatası",
            error
        });
    }
};