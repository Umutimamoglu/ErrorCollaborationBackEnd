import express from "express";
import { createError } from "../Controllers/errorsController";
import upload from "../middleware /upload";




const router = express.Router();
router.post("/create", upload.single('image'), createError);


export default router;