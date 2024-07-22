import mongoose, { Schema } from "mongoose";

const errorSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",  // User modeline referans verir.
    },
    name: {
        type: String,
        required: true,
    },
    isFixed: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        required: true,
    },
    image: {
        type: String,  // Görselin URL'si veya dosya yolu.
        required: false,  // Opsiyonel olarak tanımlanabilir.
    },
    color: {
        id: { type: String },
        name: { type: String },
        code: { type: String },
    },
    icon: {
        id: { type: String },
        name: { type: String },
        symbol: { type: String },
    },
}, {
    timestamps: true,  // Oluşturulma ve güncelleme zamanını otomatik ekler.
});

const ErrorM = mongoose.model("Error", errorSchema);

export default ErrorM;