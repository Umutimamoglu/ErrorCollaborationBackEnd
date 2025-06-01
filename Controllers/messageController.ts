import Message from "../models/messageModel";


import Chat from "../models/chatModel";
import { sendPushNotification } from "../utils/sendPushNotifications";
export const sendMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;

    try {
        const newMessage = await Message.create({ chatId, sender: senderId, message });

        // Alıcıyı bul
        const chat = await Chat.findById(chatId).populate('members');
        const recipient = chat.members.find(user => user._id.toString() !== senderId);
        if (recipient?.pushNotificationToken) {
            await sendPushNotification(
                recipient.pushNotificationToken,
                "Yeni Mesaj",
                message,
                { chatId }
            );
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json(error);
    }
};


export const getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json(error);
    }
};
