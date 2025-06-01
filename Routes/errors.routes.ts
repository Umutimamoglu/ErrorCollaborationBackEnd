import express from "express";
import { addToFavorites, createError, deleteError, getAllBugs, getAllFavori, getMyBugs, updateError, updatePushToken } from "../Controllers/errorsController";
import upload from "../middleware /upload";
import { updateUser } from "../Controllers/userControllers";





const router = express.Router();

router.post("/create", upload.single('image'), createError);

router.delete("/deleteError/:id", deleteError);
router.put("/updateError/:id", updateError);
router.get("/getMyErrors", getMyBugs);
router.get("/getAllErrors", getAllBugs)
router.post("/addToFavorites", addToFavorites)
router.get("/getAllFavori", getAllFavori)

router.put("/update", upload.single('image'), updateUser);

// routes/userRoutes.ts gibi bir yerde:
router.patch('/update-token/:userId', updatePushToken);



export default router;