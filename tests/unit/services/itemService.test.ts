import "reflect-metadata";

import { ItemService } from '../../../src/services/itemService';
import { ItemRepository } from '../../../src/repositories/itemRepository';
import { Item } from '../../../src/models/item';

// Mock the ItemRepository
jest.mock('../../../src/repositories/itemRepository');

describe('ItemService', () => {
  let itemService: ItemService;
  let itemRepository: jest.Mocked<ItemRepository>;
  
  const mockItem: Item = {
    id: 1,
    name: 'Test Item',
    description: 'This is a test item',
    createdAt: new Date(),
    updatedAt: new Date()
  } as Item;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    itemRepository = new ItemRepository() as jest.Mocked<ItemRepository>;
    itemService = new ItemService(itemRepository);
  });

  describe('getAllItems', () => {
    it('should return all items from the repository', async () => {
      // Arrange
      const mockItems = [mockItem];
      itemRepository.findAll = jest.fn().mockResolvedValue(mockItems);
      
      // Act
      const result = await itemService.getAllItems();
      
      // Assert
      expect(result).toBe(mockItems);
      expect(itemRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getItemById', () => {
    it('should return item by id from the repository', async () => {
      // Arrange
      itemRepository.findById = jest.fn().mockResolvedValue(mockItem);
      
      // Act
      const result = await itemService.getItemById(1);
      
      // Assert
      expect(result).toBe(mockItem);
      expect(itemRepository.findById).toHaveBeenCalledWith(1);
      expect(itemRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when item is not found', async () => {
      // Arrange
      itemRepository.findById = jest.fn().mockResolvedValue(null);
      
      // Act
      const result = await itemService.getItemById(999);
      
      // Assert
      expect(result).toBeNull();
      expect(itemRepository.findById).toHaveBeenCalledWith(999);
      expect(itemRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createItem', () => {
    it('should create an item via the repository', async () => {
      // Arrange
      const newItem = { name: 'New Item', description: 'New item description' } as Item;
      itemRepository.create = jest.fn().mockResolvedValue({...newItem, id: 2});
      
      // Act
      const result = await itemService.createItem(newItem);
      
      // Assert
      expect(result).toEqual({...newItem, id: 2});
      expect(itemRepository.create).toHaveBeenCalledWith(newItem);
      expect(itemRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateItem', () => {
    it('should update an item via the repository', async () => {
      // Arrange
      const updatedItem = {...mockItem, name: 'Updated Item'} as Item;
      itemRepository.update = jest.fn().mockResolvedValue(updatedItem);
      
      // Act
      const result = await itemService.updateItem(1, updatedItem);
      
      // Assert
      expect(result).toBe(updatedItem);
      expect(itemRepository.update).toHaveBeenCalledWith(1, updatedItem);
      expect(itemRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should return null if item not found', async () => {
      // Arrange
      itemRepository.update = jest.fn().mockResolvedValue(null);
      
      // Act
      const result = await itemService.updateItem(999, mockItem);
      
      // Assert
      expect(result).toBeNull();
      expect(itemRepository.update).toHaveBeenCalledWith(999, mockItem);
      expect(itemRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item via the repository and return true when successful', async () => {
      // Arrange
      itemRepository.delete = jest.fn().mockResolvedValue(true);
      
      // Act
      const result = await itemService.deleteItem(1);
      
      // Assert
      expect(result).toBe(true);
      expect(itemRepository.delete).toHaveBeenCalledWith(1);
      expect(itemRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should return false when deletion fails', async () => {
      // Arrange
      itemRepository.delete = jest.fn().mockResolvedValue(false);
      
      // Act
      const result = await itemService.deleteItem(999);
      
      // Assert
      expect(result).toBe(false);
      expect(itemRepository.delete).toHaveBeenCalledWith(999);
      expect(itemRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});