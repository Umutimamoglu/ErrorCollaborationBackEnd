import Message from "../models/messageModel";


export const sendMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;

    try {
        const newMessage = await Message.create({
            chatId,
            sender: senderId,
            message,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error sending message:', error);
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
