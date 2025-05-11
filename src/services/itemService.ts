import { injectable, inject } from "tsyringe";

import { Item } from "../models/item";
import { ItemRepository } from "../repositories/itemRepository";

@injectable()
export class ItemService {
  constructor(@inject(ItemRepository) private itemRepository: ItemRepository) {}

  async getAllItems(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async getItemById(id: number): Promise<Item | null> {
    return this.itemRepository.findById(id);
  }

  async createItem(item: Item): Promise<Item> {
    return this.itemRepository.create(item);
  }

  async updateItem(id: number, item: Item): Promise<Item | null> {
    return this.itemRepository.update(id, item);
  }

  async deleteItem(id: number): Promise<boolean> {
    return this.itemRepository.delete(id);
  }
}
