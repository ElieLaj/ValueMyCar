import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { carRoutes } from "./routes/car.route"
import cors from "cors";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors());

app.use("/api/cars", carRoutes)

export default app

