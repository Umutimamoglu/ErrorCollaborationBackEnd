import express from "express";
import cors from 'cors';
import connectToDatabase from "./db";
import userRoutes from "../Routes/user.routes";


const app = express();

app.use(express.json());
app.use(cors());

const PORT = 1337;


connectToDatabase().then(() => {
    console.log("Database connection successful");
}).catch(error => {
    console.error("Database connection error:", error);
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
});