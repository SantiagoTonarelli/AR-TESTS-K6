import "reflect-metadata";

import { ItemRepository } from "../../../src/repositories/itemRepository";
import { Item, CreateItemDTO } from "../../../src/models/item";

jest.mock("../../../src/models/item");

describe("ItemRepository", () => {
  let itemRepository: ItemRepository;

  const mockItem = {
    id: 1,
    name: "Test Item",
    description: "This is a test item",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    itemRepository = new ItemRepository();
  });

  describe("findAll", () => {
    it("should return all items", async () => {
      // Arrange
      const mockItems = [mockItem];
      (Item.findAll as jest.Mock).mockResolvedValue(mockItems);

      // Act
      const result = await itemRepository.findAll();

      // Assert
      expect(result).toBe(mockItems);
      expect(Item.findAll).toHaveBeenCalledWith({
        order: [["id", "ASC"]],
      });
    });
  });

  describe("findById", () => {
    it("should return an item by id", async () => {
      // Arrange
      (Item.findByPk as jest.Mock).mockResolvedValue(mockItem);

      // Act
      const result = await itemRepository.findById(1);

      // Assert
      expect(result).toBe(mockItem);
      expect(Item.findByPk).toHaveBeenCalledWith(1);
    });

    it("should return null if item not found", async () => {
      // Arrange
      (Item.findByPk as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await itemRepository.findById(999);

      // Assert
      expect(result).toBeNull();
      expect(Item.findByPk).toHaveBeenCalledWith(999);
    });
  });

  describe("create", () => {
    it("should create a new item", async () => {
      // Arrange
      const newItemData: CreateItemDTO = {
        name: "New Item",
        description: "New description",
      };
      const createdItem = { ...newItemData, id: 1 };
      (Item.create as jest.Mock).mockResolvedValue(createdItem);

      // Act
      const result = await itemRepository.create(newItemData);

      // Assert
      expect(result).toBe(createdItem);
      expect(Item.create).toHaveBeenCalledWith(newItemData);
    });
  });

  describe("update", () => {
    it("should update an existing item", async () => {
      // Arrange
      const updateData = { name: "Updated Name" };
      const updatedItem = { ...mockItem, ...updateData };
      (Item.update as jest.Mock).mockResolvedValue([1, [updatedItem]]);

      // Act
      const result = await itemRepository.update(1, updateData);

      // Assert
      expect(result).toBe(updatedItem);
      expect(Item.update).toHaveBeenCalledWith(updateData, {
        where: { id: 1 },
        returning: true,
      });
    });

    it("should return null if item not found", async () => {
      // Arrange
      (Item.update as jest.Mock).mockResolvedValue([0, []]);

      // Act
      const result = await itemRepository.update(999, { name: "Not Found" });

      // Assert
      expect(result).toBeNull();
      expect(Item.update).toHaveBeenCalledWith(
        { name: "Not Found" },
        {
          where: { id: 999 },
          returning: true,
        }
      );
    });
  });

  describe("delete", () => {
    it("should delete an existing item", async () => {
      // Arrange
      (Item.destroy as jest.Mock).mockResolvedValue(1);

      // Act
      const result = await itemRepository.delete(1);

      // Assert
      expect(result).toBe(true);
      expect(Item.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return false if item not found", async () => {
      // Arrange
      (Item.destroy as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await itemRepository.delete(999);

      // Assert
      expect(result).toBe(false);
      expect(Item.destroy).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
