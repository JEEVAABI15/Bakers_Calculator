import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const UserController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already registered' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      res.status(201).json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err });
    }
  },
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        bakeryName: user.bakeryName,
        bakeryAddress: user.bakeryAddress,
        bakeryPhone: user.bakeryPhone,
        bakeryEmail: user.bakeryEmail,
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch profile', error: err });
    }
  },
  async updateProfile(req, res) {
    try {
      const updates = {};
      const allowed = ['name', 'bakeryName', 'bakeryAddress', 'bakeryPhone', 'bakeryEmail'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
      }
      updates.updatedAt = new Date();
      const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        bakeryName: user.bakeryName,
        bakeryAddress: user.bakeryAddress,
        bakeryPhone: user.bakeryPhone,
        bakeryEmail: user.bakeryEmail,
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update profile', error: err });
    }
  }
}; 