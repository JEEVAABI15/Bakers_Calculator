import mongoose from 'mongoose';

const InventoryItemSchema = new mongoose.Schema({
  userId: String,
  name: String,
  totalQuantity: Number,
  unit: String,
  costPerUnit: Number,
  totalCost: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('InventoryItem', InventoryItemSchema); 