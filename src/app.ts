import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { carRoutes } from "./routes/car.route"
import cors from "cors";
import { brandRoutes } from "./routes/brand.route";
import { errorHandler } from "./middlewares/errorHandler";
import { userRoutes } from "./routes/user.route";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors());

app.use("/api/cars", carRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/users", userRoutes)

app.use(errorHandler)

export default app

