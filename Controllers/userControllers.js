"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.updateUser = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const validator_1 = __importDefault(require("validator"));
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv_1.default.config();
/**
 * Kullanıcının JWT'sini oluşturan fonksiyon.
 * @param _id Kullanıcının MongoDB ObjectId'si.
 * @returns Oluşturulan JWT.
 */
const getUserToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY || "DEFAULT_SECRET";
    return jsonwebtoken_1.default.sign({ _id }, jwtKey, { expiresIn: "1y" }); // 1 yıl geçerli token
};
/**
 * Kullanıcı Kaydı (Register)
 */
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("📩 Gelen Kayıt İsteği:", request.body); // 📌 Gelen JSON verisini logla
        const { name, email, password, image, positionTitle } = request.body;
        // 1) Gerekli alanları kontrol et
        if (!name || !email || !password) {
            return response.status(400).json({ message: "Name, email, and password are required" });
        }
        // 2) Email formatı kontrol et
        if (!validator_1.default.isEmail(email)) {
            return response.status(400).json({ message: "Email must be a valid email" });
        }
        // 3) Kullanıcının zaten var olup olmadığını kontrol et
        let existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return response.status(409).json({ message: "User already exists" });
        }
        // 4) Şifreyi hashleme
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // 5) Yeni kullanıcı oluştur
        const newUser = new userModel_1.default({
            name,
            email,
            password: hashedPassword,
            image: image || "https://example.com/default-profile.png",
            positionTitle: positionTitle || "Unspecified Position",
        });
        // 6) Kullanıcıyı kaydet
        yield newUser.save();
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
    }
    catch (error) {
        console.error("❌ Hata - createUser fonksiyonu:", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
});
exports.createUser = createUser;
/**
 * Kullanıcı Girişi (Login)
 */
const loginUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("📩 Gelen Giriş İsteği:", request.body); // 📌 Gelen JSON verisini logla
        const { email, password } = request.body;
        const existingUser = yield userModel_1.default.findOne({ email });
        if (!existingUser) {
            console.log("🚨 Kullanıcı bulunamadı:", email);
            return response.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
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
    }
    catch (error) {
        console.error("❌ loginUser Hatası:", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
});
exports.loginUser = loginUser;
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, positionTitle } = request.body; //
        const image = request.file ? request.file.path : null;
        if (!name || !email || !image) {
            return response.status(400).json({ message: "İsim, e-posta ve resim alanları zorunludur" });
        }
        if (!validator_1.default.isEmail(email)) {
            return response.status(400).json({ message: "Geçerli bir e-posta adresi girin" });
        }
        let user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return response.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        user.name = name;
        user.positionTitle = positionTitle;
        user.image = image;
        if (request.body.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password = yield bcrypt_1.default.hash(request.body.password, salt);
        }
        yield user.save();
        return response.status(200).json({ _id: user._id, name, image: user.image, positionTitle });
    }
    catch (error) {
        console.error("updateUser fonksiyonunda hata oluştu", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
});
exports.updateUser = updateUser;
const getUserById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = request.params;
        const user = yield userModel_1.default.findById(userId).select('-password');
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
    }
    catch (error) {
        console.error("getUserById fonksiyonunda hata oluştu", error);
        return response.status(500).json({ message: "Sunucu hatası", error });
    }
});
exports.getUserById = getUserById;
