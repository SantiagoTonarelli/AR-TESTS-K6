import "reflect-metadata";
import request from 'supertest';
import { container } from 'tsyringe';

import app from '../../src/app';
import { Item } from '../../src/models/item';
import { ItemRepository } from '../../src/repositories/itemRepository';

// Mock the repository module
jest.mock('../../src/repositories/itemRepository');

describe('Items API', () => {
  let mockItemRepository: jest.Mocked<ItemRepository>;
  
  const baseMockItemDate = new Date(); // Use a fixed date for mockItem for consistency
  const mockItem = {
    id: 1,
    name: 'Test Item',
    description: 'This is a test item',
    createdAt: baseMockItemDate,
    updatedAt: baseMockItemDate,
  } as Item;
  
  beforeEach(() => {
    jest.clearAllMocks();
    container.clearInstances(); // Clear cached DI instances
    
    // Create a mock repository and register it in the DI container
    mockItemRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ItemRepository>;
    
    // Register the mock in the DI container
    container.registerInstance(ItemRepository, mockItemRepository);
  });
  
  describe('GET /api/items', () => {
    it('should return all items', async () => {
      // Arrange
      const mockItems = [mockItem];
      mockItemRepository.findAll.mockResolvedValue(mockItems);
      
      // Act
      const response = await request(app).get('/api/items');
      
      // Assert
      expect(response.status).toBe(200);
      // Compare with JSON stringified version to handle Date objects correctly
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockItems)));
      expect(mockItemRepository.findAll).toHaveBeenCalled();
    });
  });
  
  describe('GET /api/items/:id', () => {
    it('should return a single item by id', async () => {
      // Arrange
      mockItemRepository.findById.mockResolvedValue(mockItem as Item);
      
      // Act
      const response = await request(app).get('/api/items/1');
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockItem)));
      expect(mockItemRepository.findById).toHaveBeenCalledWith(1);
    });
    
    it('should return 404 if item is not found', async () => {
      // Arrange
      mockItemRepository.findById.mockResolvedValue(null);
      
      // Act
      const response = await request(app).get('/api/items/999');
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(mockItemRepository.findById).toHaveBeenCalledWith(999);
    });
  });
  
  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      // Arrange
      const newItemData = {
        name: 'New Item',
        description: 'New description',
      };
      const dateCreated = new Date();
      const createdItemWithDates = { 
        ...newItemData, 
        id: 1, 
        createdAt: dateCreated, 
        updatedAt: dateCreated 
      };
      mockItemRepository.create.mockResolvedValue(createdItemWithDates as Item);
      
      // Act
      const response = await request(app)
        .post('/api/items')
        .send(newItemData);
      
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(createdItemWithDates)));
      expect(mockItemRepository.create).toHaveBeenCalledWith(newItemData);
    });
  });
  
  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      // Arrange
      const updateData = { name: 'Updated Name' };
      const dateUpdated = new Date();
      const updatedItemWithDates = { 
        ...mockItem, // Spread original mock item to keep its id, description, createdAt
        ...updateData, // Apply updates
        updatedAt: dateUpdated // Set new updatedAt
      };
      mockItemRepository.update.mockResolvedValue(updatedItemWithDates as Item);
      
      // Act
      const response = await request(app)
        .put('/api/items/1')
        .send(updateData);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(updatedItemWithDates)));
      expect(mockItemRepository.update).toHaveBeenCalledWith(1, updateData);
    });
    
    it('should return 404 if item to update is not found', async () => {
      // Arrange
      mockItemRepository.update.mockResolvedValue(null);
      
      // Act
      const response = await request(app)
        .put('/api/items/999')
        .send({ name: 'Updated Name' });
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(mockItemRepository.update).toHaveBeenCalledWith(999, { name: 'Updated Name' });
    });
  });
  
  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      // Arrange
      mockItemRepository.delete.mockResolvedValue(true);
      
      // Act
      const response = await request(app)
        .delete('/api/items/1')
        .set('Authorization', 'Bearer secret-token');
      
      // Assert
      expect(response.status).toBe(204);
      expect(mockItemRepository.delete).toHaveBeenCalledWith(1);
    });
    
    it('should return 404 if item to delete is not found', async () => {
      // Arrange
      mockItemRepository.delete.mockResolvedValue(false);
      
      // Act
      const response = await request(app)
        .delete('/api/items/999')
        .set('Authorization', 'Bearer secret-token');
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Item not found');
      expect(mockItemRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});