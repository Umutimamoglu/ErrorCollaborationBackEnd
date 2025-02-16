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
exports.getMessages = exports.sendMessage = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, senderId, message } = req.body;
    try {
        const newMessage = yield messageModel_1.default.create({
            chatId,
            sender: senderId,
            message,
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log('Error sending message:', error);
        res.status(500).json(error);
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const messages = yield messageModel_1.default.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json(error);
    }
});
exports.getMessages = getMessages;
