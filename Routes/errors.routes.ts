import express from "express";
import { createError, getMyBugs } from "../Controllers/errorsController";
import upload from "../middleware /upload";




const router = express.Router();
router.post("/create", upload.single('image'), createError);
router.get("/getMyErrors", getMyBugs);


export default router;