import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';

import { configureItemRoutes } from "./routes/itemRoutes";
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/items", configureItemRoutes());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default app;
