import express from "express"
import { createUser, getUserById, loginUser, updateUser } from "../Controllers/userControllers"
import upload from "../middleware /upload"

const userRoutes = express.Router()
userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
userRoutes.route("/getUser/:userId").get(getUserById)
userRoutes.route("/updateUser").put(upload.single("image"), updateUser);

export default userRoutes