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
exports.findChat = exports.findUserChats = exports.createChat = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstId, secondId } = req.body;
    try {
        const chat = yield chatModel_1.default.findOne({
            members: { $all: [firstId, secondId] },
        });
        if (chat)
            return res.status(200).json(chat);
        const newChat = new chatModel_1.default({
            members: [firstId, secondId],
        });
        const response = yield newChat.save();
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.createChat = createChat;
const findUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const chats = yield chatModel_1.default.find({
            members: userId
        });
        res.status(200).json(chats);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.findUserChats = findUserChats;
const findChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstId, secondId } = req.params;
    try {
        const chat = yield chatModel_1.default.findOne({
            members: { $all: [firstId, secondId] }
        });
        res.status(200).json(chat);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.findChat = findChat;
