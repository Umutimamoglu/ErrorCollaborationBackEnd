import Message from "../models/messageModel";
import Chat from "../models/chatModel";
import { sendPushNotification } from "../utils/sendPushNotifications";


export const sendMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;

    try {
        // 1. Yeni mesajı oluştur
        const newMessage = await Message.create({ chatId, sender: senderId, message });

        // 2. Chat üzerinden alıcıyı bul
        const chat = await Chat.findById(chatId).populate('members');
        const recipient = chat.members.find(user => user._id.toString() !== senderId);

        // 3. Bildirim gönder
        if (recipient?.pushNotificationToken) {
            await sendPushNotification(
                recipient.pushNotificationToken,
                "Yeni Mesaj",
                message,
                {
                    screen: "ChatScreen",
                    params: {
                        chatId,
                        senderUserId: senderId, // 💡 Bildirime gönderen kişinin ID'sini ekle
                    },
                }
            );
        }

        // 4. Yanıt dön
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: "Mesaj gönderilirken hata oluştu", error });
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
