import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';

import { configureItemRoutes } from "./routes/itemRoutes";
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/items", configureItemRoutes());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default app;
