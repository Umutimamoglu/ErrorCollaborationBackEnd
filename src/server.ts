import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';  // path modülünü ekledim
import connectToDatabase from "./db";
import userRoutes from "../Routes/user.routes";
import errorRoutes from "../Routes/errors.routes";
import { authenticationMiddleware } from "../middleware ";
import messageRoutes from "../Routes/message.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Uploads dizinini statik olarak sunuyoruz
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 1337;

connectToDatabase().then(() => {
    console.log("Database connection successful");
}).catch(error => {
    console.error("Database connection error:", error);
});

// Login ve Register rotaları için authenticationMiddleware kullanmıyoruz
app.use("/users", userRoutes);

// Diğer tüm /api rotaları için authenticationMiddleware kullanıyoruz
app.use("/api/errors", authenticationMiddleware, errorRoutes);
app.use("/api/chat", authenticationMiddleware, messageRoutes)

app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
});