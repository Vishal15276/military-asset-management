import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT with role included
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// @desc Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (save role too)
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role 
    });

    // Return safe user object
    const safeUser = { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    };

    res.json({ success: true, user: safeUser, token: generateToken(user._id, user.role) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const safeUser = { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    };

    res.json({ success: true, user: safeUser, token: generateToken(user._id, user.role) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
