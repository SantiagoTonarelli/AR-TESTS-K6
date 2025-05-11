import { injectable } from "tsyringe";

import { Item, CreateItemDTO } from "../models/item";

@injectable()
export class ItemRepository {
  async findAll(): Promise<Item[]> {
    return Item.findAll({
      order: [['id', 'ASC']]
    });
  }

  async findById(id: number): Promise<Item | null> {
    return Item.findByPk(id);
  }

  async create(itemData: CreateItemDTO): Promise<Item> {
    return Item.create(itemData);
  }

  async update(id: number, itemData: Partial<CreateItemDTO>): Promise<Item | null> {
    const [affectedCount, affectedRows] = await Item.update(itemData, {
      where: { id },
      returning: true
    });
    
    return affectedCount > 0 ? affectedRows[0] : null;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await Item.destroy({
      where: { id }
    });
    
    return deletedRows > 0;
  }
}
