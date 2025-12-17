import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the structure of the data inside the token
interface TokenPayload {
  userId: string;
  email: string;
  companyId: string;
  role: string;
}

// Extend Express Request to include 'user'
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (
  req: Request, // We use standard Request here and cast it inside if needed, or use AuthRequest
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Attach user info to request
    (req as AuthRequest).user = decoded;

    // ✅ CRITICAL: Call next() to pass control to the Controller
    next(); 
    
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};