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
exports.authenticationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const authenticationMiddleware = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = request.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            console.log("Authorization header missing or malformed:", authorization); // Gelen header'ı loglayın
            return response.status(401).json({ error: "Authorization required" });
        }
        const token = authorization.split(' ')[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "fallback_secret_key");
        console.log("Decoded Token:", decodedToken); // Token içeriğini loglayın
        const { _id } = decodedToken;
        const existingUser = yield userModel_1.default.findById(_id);
        if (existingUser) {
            request.userId = existingUser._id.toString();
            next();
        }
        else {
            console.log("User not found for token:", _id);
            return response.status(401).json({ error: "Invalid token" });
        }
    }
    catch (error) {
        console.log("Error in authenticationMiddleware:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return response.status(401).json({ error: "Token has expired", detailedError: error.message });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return response.status(401).json({ error: "Invalid token", detailedError: error.message });
        }
        else {
            return response.status(500).json({ error: "Authentication error", detailedError: error.message });
        }
    }
});
exports.authenticationMiddleware = authenticationMiddleware;
