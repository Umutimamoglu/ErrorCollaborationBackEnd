import express from "express"
import { createError } from "../Controllers/errorsController"

const errorRoutes = express.Router()

errorRoutes.route("/create").post(createError)



export default errorRoutes