import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateToken } from '../utils/auth';

const router = express.Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, className, isAdmin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      className,
      role: isAdmin ? 'admin' : 'user'  // Assign role based on isAdmin flag
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);

    // Return user data without password
    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ 
      token,
      user: { 
        ...userData,
        password: undefined // Remove password from response
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data without password
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ 
      token,
      user: { 
        ...userData,
        password: undefined // Remove password from response
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;