import "reflect-metadata";
import { Router } from "express";
import { container } from "tsyringe";

import { ItemController } from "../controllers/itemController";
import { authMiddleware } from "../middlewares/authMiddleware";

export function configureItemRoutes(): Router {
  const router = Router();

  router.get("/", (req, res) => container.resolve(ItemController).getAllItems(req, res));
  router.get("/:id", (req, res) => container.resolve(ItemController).getItemById(req, res));
  router.post("/", (req, res) => container.resolve(ItemController).createItem(req, res));
  router.put("/:id", (req, res) => container.resolve(ItemController).updateItem(req, res));
  router.delete("/:id", authMiddleware, (req, res) => container.resolve(ItemController).deleteItem(req, res));

  return router;
}
