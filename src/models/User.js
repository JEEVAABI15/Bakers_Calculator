import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  bakeryName: { type: String, default: '' },
  bakeryAddress: { type: String, default: '' },
  bakeryPhone: { type: String, default: '' },
  bakeryEmail: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: { type: String, default: 'free' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema); 