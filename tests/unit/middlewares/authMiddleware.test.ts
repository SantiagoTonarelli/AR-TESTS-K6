
import { Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../../../src/middlewares/authMiddleware';

describe('AuthMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  
  beforeEach(() => {
    // Reset mocks before each test
    req = {
      headers: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });
  
  it('should call next() when valid authorization token is provided', () => {
    // Arrange
    req.headers = {
      authorization: 'Bearer secret-token'
    };
    
    // Act
    authMiddleware(req as Request, res as Response, next);
    
    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  
  it('should return 401 when authorization header is missing', () => {
    // Arrange - already set up in beforeEach
    
    // Act
    authMiddleware(req as Request, res as Response, next);
    
    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authorization header is required'
    });
  });
  
  it('should return 403 when invalid authorization token is provided', () => {
    // Arrange
    req.headers = {
      authorization: 'Bearer invalid-token'
    };
    
    // Act
    authMiddleware(req as Request, res as Response, next);
    
    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid authorization token'
    });
  });
});