import express from "express";
import { createError, deleteError, getAllBugs, getMyBugs, updateError } from "../Controllers/errorsController";
import upload from "../middleware /upload";




const router = express.Router();
router.post("/create", upload.single('image'), createError);
router.delete("/deleteError/:id", deleteError);
router.put("/updateError/:id", updateError);
router.get("/getMyErrors", getMyBugs);
router.get("/getAllErrors", getAllBugs)


export default router;