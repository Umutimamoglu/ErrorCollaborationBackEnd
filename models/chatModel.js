"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    members: Array,
}, {
    timestamps: true,
});
const chatModel = mongoose.model("Chat", chatSchema);
exports.default = chatModel;
