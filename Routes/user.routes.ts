import express from "express"
import { createUser, loginUser, updateUser } from "../Controllers/userControllers"
import upload from "../middleware /upload"

const userRoutes = express.Router()
userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
userRoutes.put("/update", upload.single('image'), updateUser);
export default userRoutes