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
exports.getAllFavori = exports.addToFavorites = exports.getAllBugs = exports.getMyBugs = exports.deleteError = exports.updateError = exports.createError = void 0;
const errorModel_1 = __importDefault(require("../models/errorModel"));
const favoritesModel_1 = __importDefault(require("../models/favoritesModel"));
const createError = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Gelen verileri logla
        console.log("Request Body:", request.body);
        console.log("Uploaded File:", request.file);
        console.log("User ID:", request.userId);
        // request.body'den değerleri al
        const { color, name, isFixed, language, type, howDidIFix } = request.body;
        const image = request.file ? request.file.path : null; // Yüklenen dosyanın yolu
        // Kullanıcı kimliği kontrolü
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }
        // Eksik alanları kontrol et ve logla
        if (!name || !color || !language || !type || !howDidIFix) {
            console.log("Eksik alanlar:");
            if (!name)
                console.log("Eksik alan: name");
            if (!color)
                console.log("Eksik alan: color");
            if (!language)
                console.log("Eksik alan: language");
            if (!type)
                console.log("Eksik alan: type");
            if (!howDidIFix)
                console.log("Eksik alan: howDidIFix");
            return response.status(400).json({ message: "Required fields are missing." });
        }
        // Yeni hata kaydını oluştur
        const newError = yield errorModel_1.default.create({
            user: request.userId,
            name,
            isFixed: isFixed || false,
            image,
            color,
            language,
            type,
            howDidIFix,
        });
        console.log("Yeni hata başarıyla oluşturuldu:", newError);
        response.status(201).json(newError);
        console.log("Frontend'den gelen renk:", request.body.color);
        console.log("MongoDB'ye kaydedilen renk:", newError.color);
    }
    catch (error) {
        console.error("Error in createError:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.createError = createError;
const updateError = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params; // ID, URL parametresinden alınır
        const { color, name, isFixed, language, type, howDidIFix } = request.body;
        const image = request.file ? request.file.path : undefined;
        if (!request.userId) {
            return response.status(401).json({ message: "User not authenticated." });
        }
        const updateFields = {};
        if (color)
            updateFields.color = color;
        if (name)
            updateFields.name = name;
        if (typeof isFixed !== 'undefined')
            updateFields.isFixed = isFixed;
        if (language)
            updateFields.language = language;
        if (type)
            updateFields.type = type;
        if (howDidIFix)
            updateFields.howDidIFix = howDidIFix;
        if (image)
            updateFields.image = image;
        const updatedError = yield errorModel_1.default.findOneAndUpdate({ _id: id, user: request.userId }, { $set: updateFields }, { new: true });
        if (!updatedError) {
            return response.status(404).json({ message: "Error not found or not authorized to update." });
        }
        response.status(200).json(updatedError);
    }
    catch (error) {
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.updateError = updateError;
const deleteError = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }
        const error = yield errorModel_1.default.findOneAndDelete({ _id: id, user: request.userId });
        if (!error) {
            return response.status(404).json({ message: "Error not found or not authorized to delete." });
        }
        response.status(200).json({ message: "Error deleted successfully.", error });
    }
    catch (error) {
        console.error("Error in deleteError:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.deleteError = deleteError;
const getMyBugs = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }
        const userErrors = yield errorModel_1.default.find({ user: request.userId });
        if (!userErrors) {
            return response.status(404).json({ message: "No errors found for this user." });
        }
        response.status(200).json(userErrors);
    }
    catch (error) {
        console.error("Error in getMyBugs:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.getMyBugs = getMyBugs;
const getAllBugs = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allErrors = yield errorModel_1.default.find().populate('user', 'name email');
        response.status(200).json(allErrors);
    }
    catch (error) {
        console.error("Error in getAllBugs:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.getAllBugs = getAllBugs;
const addToFavorites = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { color, name, isFixed, language, type, howDidIFix } = request.body;
        const image = request.file ? request.file.path : null;
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }
        if (!name || !color || !language || !type || !howDidIFix) {
            return response.status(400).json({ message: "Required fields are missing." });
        }
        const addFavori = yield favoritesModel_1.default.create({
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
    }
    catch (error) {
        console.error("Error in createError:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.addToFavorites = addToFavorites;
const getAllFavori = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.userId) {
            console.log("User ID is not available. User not authenticated.");
            return response.status(401).json({ message: "User not authenticated." });
        }
        // Fetch user's favorite errors and populate the user field
        const userErrors = yield favoritesModel_1.default.find({ user: request.userId }).populate('user');
        if (!userErrors || userErrors.length === 0) {
            return response.status(404).json({ message: "No errors found for this user." });
        }
        response.status(200).json(userErrors);
    }
    catch (error) {
        console.error("Error in getAllFavori:", error);
        response.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
exports.getAllFavori = getAllFavori;
