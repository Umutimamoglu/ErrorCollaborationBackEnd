"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userControllers_1 = require("../Controllers/userControllers");
var userRoutes = express_1.default.Router();
userRoutes.route("/create").post(userControllers_1.createUser);
userRoutes.route("/login").post(userControllers_1.loginUser);
exports.default = userRoutes;
