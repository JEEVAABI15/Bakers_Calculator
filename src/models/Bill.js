import mongoose from 'mongoose';

const BillItemSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  quantity: Number,
  costPrice: Number,
  sellingPrice: Number,
  totalAmount: Number,
});

const AdditionalCostSchema = new mongoose.Schema({
  id: String,
  description: String,
  amount: Number,
});

const BillSchema = new mongoose.Schema({
  userId: String,
  billNumber: String,
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  items: [BillItemSchema],
  additionalCosts: [AdditionalCostSchema],
  subtotal: Number,
  additionalCostsTotal: Number,
  discountPercentage: Number,
  discountAmount: Number,
  totalAmount: Number,
  profitAmount: Number,
  profitPercentage: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bill', BillSchema); 