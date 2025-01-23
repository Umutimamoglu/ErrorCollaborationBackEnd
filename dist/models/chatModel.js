"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var chatSchema = new mongoose.Schema({
    members: Array,
}, {
    timestamps: true,
});
var chatModel = mongoose.model("Chat", chatSchema);
exports.default = chatModel;
