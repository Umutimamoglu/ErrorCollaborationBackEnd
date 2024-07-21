const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;