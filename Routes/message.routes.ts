import express from "express";

import { getMessages, sendMessage } from "../Controllers/messageController";
import { createChat, findChat, findUserChats } from "../Controllers/chatt controller";

const messageRoutes = express.Router();

messageRoutes.route("/chat").post(createChat);
messageRoutes.route("/chats/:userId").get(findUserChats);
messageRoutes.route("/chat/:firstId/:secondId").get(findChat);

messageRoutes.route("/message").post(sendMessage);
messageRoutes.route("/messages/:chatId").get(getMessages);

export default messageRoutes;
