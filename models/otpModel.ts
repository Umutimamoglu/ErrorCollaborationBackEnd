import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

// OTP şeması: email ve otp alanları, createdAt ile TTL indeksi
const otpSchema = new Schema<IOTP>(
    {
        email: {
            type: String,
            required: true,
            index: true, // sorgular hızlı olsun
        },
        otp: {
            type: String,
            required: true,
            index: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 5, // 5 dakika sonra otomatik silinir
        },
    },
    {
        timestamps: false, // createdAt zaten tanımlı; updatedAt ihtiyacınız yoksa false bırakabilirsiniz
    }
);

export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
