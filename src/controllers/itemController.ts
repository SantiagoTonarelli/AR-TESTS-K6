import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { ItemService } from "../services/itemService";

@injectable()
export class ItemController {
  constructor(@inject(ItemService) private itemService: ItemService) {}

  /**
   * @swagger
   * /items:
   *   get:
   *     summary: Retrieve a list of items
   *     tags: [Items]
   *     responses:
   *       200:
   *         description: A list of items.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Item'
   *       500:
   *         description: Error fetching items
   */
  async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemService.getAllItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching items", error });
    }
  }

  /**
   * @swagger
   * /items/{id}:
   *   get:
   *     summary: Retrieve a single item by ID
   *     tags: [Items]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the item to retrieve
   *     responses:
   *       200:
   *         description: A single item.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Item'
   *       404:
   *         description: Item not found
   *       500:
   *         description: Error fetching item
   */
  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await this.itemService.getItemById(id);

      if (!item) {
        res.status(404).json({ message: "Item not found" });
        return;
      }

      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: "Error fetching item", error });
    }
  }

  /**
   * @swagger
   * /items:
   *   post:
   *     summary: Create a new item
   *     tags: [Items]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateItemDTO'
   *     responses:
   *       201:
   *         description: The item was successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Item'
   *       500:
   *         description: Error creating item
   */
  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const item = req.body;
      const newItem = await this.itemService.createItem(item);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: "Error creating item", error });
    }
  }

  /**
   * @swagger
   * /items/{id}:
   *   put:
   *     summary: Update an existing item
   *     tags: [Items]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the item to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateItemDTO'
   *     responses:
   *       200:
   *         description: The item was successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Item'
   *       404:
   *         description: Item not found
   *       500:
   *         description: Error updating item
   */
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const itemData = req.body;
      const updatedItem = await this.itemService.updateItem(id, itemData);

      if (!updatedItem) {
        res.status(404).json({ message: "Item not found" });
        return;
      }

      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating item", error });
    }
  }

  /**
   * @swagger
   * /items/{id}:
   *   delete:
   *     summary: Delete an item
   *     tags: [Items]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: Numeric ID of the item to delete
   *     responses:
   *       204:
   *         description: The item was successfully deleted.
   *       401:
   *         description: Unauthorized - Authorization header is required.
   *       403:
   *         description: Forbidden - Invalid authorization token.
   *       404:
   *         description: Item not found
   *       500:
   *         description: Error deleting item
   */
  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await this.itemService.deleteItem(id);

      if (!deleted) {
        res.status(404).json({ message: "Item not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting item", error });
    }
  }
}
