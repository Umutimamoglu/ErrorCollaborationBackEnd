import express from "express";
import { createError, getAllBugs, getMyBugs } from "../Controllers/errorsController";
import upload from "../middleware /upload";




const router = express.Router();
router.post("/create", upload.single('image'), createError);
router.get("/getMyErrors", getMyBugs);
router.get("/getAllErrors", getAllBugs)


export default router;