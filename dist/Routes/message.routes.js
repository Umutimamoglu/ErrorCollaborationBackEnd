"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var messageController_1 = require("../Controllers/messageController");
var chatt_controller_1 = require("../Controllers/chatt controller");
var messageRoutes = express_1.default.Router();
messageRoutes.route("/chat").post(chatt_controller_1.createChat);
messageRoutes.route("/chats/:userId").get(chatt_controller_1.findUserChats);
messageRoutes.route("/chat/:firstId/:secondId").get(chatt_controller_1.findChat);
messageRoutes.route("/message").post(messageController_1.sendMessage);
messageRoutes.route("/messages/:chatId").get(messageController_1.getMessages);
exports.default = messageRoutes;
