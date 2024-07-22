import express from "express";
import cors from 'cors';
import connectToDatabase from "./db";
import userRoutes from "../Routes/user.routes";
import errorRoutes from "../Routes/errors.routes";
import dotenv from 'dotenv';
import { authenticationMiddleware } from "../middleware ";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authenticationMiddleware);

const PORT = 1337;


connectToDatabase().then(() => {
    console.log("Database connection successful");
}).catch(error => {
    console.error("Database connection error:", error);
});

app.use("/user", userRoutes);
app.use('/api/error', errorRoutes);

app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
});