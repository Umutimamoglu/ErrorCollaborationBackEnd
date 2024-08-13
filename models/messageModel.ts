
import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message
