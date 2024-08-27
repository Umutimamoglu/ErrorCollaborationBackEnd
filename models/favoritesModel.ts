
import mongoose, { Schema } from "mongoose";

const favoritesSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
    },
    name: {
        type: String,
        required: false,
    },
    isFixed: {
        type: Boolean,
        default: false,
    },

    image: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: true,
    },
    color: {
        id: { type: String },
        name: { type: String },
        code: { type: String },
    },
    type: {
        type: String,
        required: true,
    },
    howDidIFix: {
        type: String,
        required: true,
    }


}, {
    timestamps: true,
});

const favoritesModel = mongoose.model("Favorites", favoritesSchema);

export default favoritesModel;