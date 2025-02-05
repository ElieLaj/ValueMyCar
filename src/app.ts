import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { carRoutes } from "./routes/car.route"
import { brandRoutes } from "./routes/brand.route";
import { userRoutes } from "./routes/user.route";
import { rentalRoutes } from "./routes/rental.route";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config()

const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API du test de Value my Car',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['**/*.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json())
app.use(cors());

app.use("/api/cars", carRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/users", userRoutes)
app.use("/api/rentals", rentalRoutes)

app.use(errorHandler)

export default app

