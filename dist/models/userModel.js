"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 200,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        maxLength: 200,
    },
    password: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 1024,
    },
}, {
    timestamps: true,
});
var User = mongoose.model("User", userSchema);
exports.default = User;
