import "reflect-metadata";
import { container } from "tsyringe";

import { ItemController } from "../controllers/itemController";
import { ItemRepository } from "../repositories/itemRepository";
import { ItemService } from "../services/itemService";

container.registerSingleton(ItemRepository);

container.register(ItemService, { useClass: ItemService });

container.register(ItemController, { useClass: ItemController });

export default container;
