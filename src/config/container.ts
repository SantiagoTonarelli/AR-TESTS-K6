import "reflect-metadata";
import { container } from "tsyringe";
import { ItemController } from "../controllers/itemController";
import { ItemRepository } from "../repositories/itemRepository";
import { ItemService } from "../services/itemService";

// Register repositories
container.registerSingleton(ItemRepository);

// Register services
container.register(ItemService, { useClass: ItemService });

// Register controllers
container.register(ItemController, { useClass: ItemController });

export default container;
