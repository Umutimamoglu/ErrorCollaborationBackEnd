import chatModel from "../models/chatModel";





export const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (chat) return res.status(200).json(chat); // Chat odası varsa, onu geri döndür

        const newChat = new chatModel({
            members: [firstId, secondId],
        });

        const response = await newChat.save();
        res.status(200).json(response); // Yeni chat odası oluşturulmuşsa, onu geri döndür

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: userId
        });
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        });
        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
