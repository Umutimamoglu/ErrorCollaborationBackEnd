import express from "express";
import { addToFavorites, createError, deleteError, getAllBugs, getAllFavori, getMyBugs, updateError } from "../Controllers/errorsController";
import upload from "../middleware /upload";





const router = express.Router();
router.post("/create", upload.single('image'), createError);

router.delete("/deleteError/:id", deleteError);
router.put("/updateError/:id", updateError);
router.get("/getMyErrors", getMyBugs);
router.get("/getAllErrors", getAllBugs)
router.post("/addToFavorites", addToFavorites)
router.get("/getAllFavori", getAllFavori)


export default router;