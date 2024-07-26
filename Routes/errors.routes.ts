import express from "express";
import { createError } from "../Controllers/errorsController";



const router = express.Router();

router.post("/create", createError);


export default router;