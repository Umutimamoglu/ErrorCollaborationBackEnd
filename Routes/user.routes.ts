import express from "express"
import { createUser, getUserById, loginUser, updateUser } from "../Controllers/userControllers"
import upload from "../middleware /upload"
import { updatePushToken } from "../Controllers/errorsController"
import { sendOTP } from "../Controllers/otpController"

const userRoutes = express.Router()
userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
userRoutes.route("/getUser/:userId").get(getUserById)
userRoutes.route("/updateUser").put(upload.single("image"), updateUser);
// routes/userRoutes.ts gibi bir yerde:
userRoutes.patch('/update-token/:userId', updatePushToken);

userRoutes.post('/send-otp', sendOTP);
export default userRoutes