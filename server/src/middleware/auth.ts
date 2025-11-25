import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.role = decoded.role;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is admin
export const adminOnly = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    
    req.userId = decoded.userId;
    req.role = decoded.role;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};