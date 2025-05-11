import { Request, Response } from 'express';
import "reflect-metadata";

import { ItemController } from '../../../src/controllers/itemController';
import { ItemService } from '../../../src/services/itemService';

jest.mock('../../../src/services/itemService');

describe('ItemController', () => {
  let itemController: ItemController;
  let itemService: jest.Mocked<ItemService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  const mockItem = {
    id: 1,
    name: 'Test Item',
    description: 'This is a test item',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    itemService = new ItemService(null as any) as jest.Mocked<ItemService>;
    itemController = new ItemController(itemService);
    
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('getAllItems', () => {
    it('should return all items with status 200', async () => {
      // Arrange
      const mockItems = [mockItem];
      itemService.getAllItems = jest.fn().mockResolvedValue(mockItems);
      
      // Act
      await itemController.getAllItems(req as Request, res as Response);
      
      // Assert
      expect(itemService.getAllItems).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });
    
    it('should handle errors and return status 500', async () => {
      // Arrange
      const error = new Error('Test error');
      itemService.getAllItems = jest.fn().mockRejectedValue(error);
      
      // Act
      await itemController.getAllItems(req as Request, res as Response);
      
      // Assert
      expect(itemService.getAllItems).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching items',
        error
      });
    });
  });

  describe('getItemById', () => {
    beforeEach(() => {
      req.params = { id: '1' };
    });
    
    it('should return item with status 200 when found', async () => {
      // Arrange
      itemService.getItemById = jest.fn().mockResolvedValue(mockItem);
      
      // Act
      await itemController.getItemById(req as Request, res as Response);
      
      // Assert
      expect(itemService.getItemById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItem);
    });

    it('should return status 404 when item is not found', async () => {
      // Arrange
      itemService.getItemById = jest.fn().mockResolvedValue(null);
      
      // Act
      await itemController.getItemById(req as Request, res as Response);
      
      // Assert
      expect(itemService.getItemById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });
    
    it('should handle errors and return status 500', async () => {
      // Arrange
      const error = new Error('Test error');
      itemService.getItemById = jest.fn().mockRejectedValue(error);
      
      // Act
      await itemController.getItemById(req as Request, res as Response);
      
      // Assert
      expect(itemService.getItemById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching item',
        error
      });
    });
  });

  describe('createItem', () => {
    beforeEach(() => {
      req.body = { name: 'New Item', description: 'A new test item' };
    });
    
    it('should create item and return status 201', async () => {
      // Arrange
      const createdItem = { ...req.body, id: 1 };
      itemService.createItem = jest.fn().mockResolvedValue(createdItem);
      
      // Act
      await itemController.createItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.createItem).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
    });
    
    it('should handle errors and return status 500', async () => {
      // Arrange
      const error = new Error('Test error');
      itemService.createItem = jest.fn().mockRejectedValue(error);
      
      // Act
      await itemController.createItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.createItem).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating item',
        error
      });
    });
  });

  describe('updateItem', () => {
    beforeEach(() => {
      req.params = { id: '1' };
      req.body = { name: 'Updated Item', description: 'An updated test item' };
    });
    
    it('should update item and return status 200 when found', async () => {
      // Arrange
      const updatedItem = { ...req.body, id: 1 };
      itemService.updateItem = jest.fn().mockResolvedValue(updatedItem);
      
      // Act
      await itemController.updateItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.updateItem).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it('should return status 404 when item is not found', async () => {
      // Arrange
      itemService.updateItem = jest.fn().mockResolvedValue(null);
      
      // Act
      await itemController.updateItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.updateItem).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });
    
    it('should handle errors and return status 500', async () => {
      // Arrange
      const error = new Error('Test error');
      itemService.updateItem = jest.fn().mockRejectedValue(error);
      
      // Act
      await itemController.updateItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.updateItem).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating item',
        error
      });
    });
  });

  describe('deleteItem', () => {
    beforeEach(() => {
      req.params = { id: '1' };
    });
    
    it('should delete item and return status 204 when found', async () => {
      // Arrange
      itemService.deleteItem = jest.fn().mockResolvedValue(true);
      
      // Act
      await itemController.deleteItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.deleteItem).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return status 404 when item is not found', async () => {
      // Arrange
      itemService.deleteItem = jest.fn().mockResolvedValue(false);
      
      // Act
      await itemController.deleteItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.deleteItem).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item not found' });
    });
    
    it('should handle errors and return status 500', async () => {
      // Arrange
      const error = new Error('Test error');
      itemService.deleteItem = jest.fn().mockRejectedValue(error);
      
      // Act
      await itemController.deleteItem(req as Request, res as Response);
      
      // Assert
      expect(itemService.deleteItem).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting item',
        error
      });
    });
  });
});