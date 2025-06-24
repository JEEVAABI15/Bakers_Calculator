import mongoose from 'mongoose';

const ProductIngredientSchema = new mongoose.Schema({
  ingredientId: String,
  ingredientName: String,
  quantity: Number,
  unit: String,
  cost: Number,
});

const ProductSchema = new mongoose.Schema({
  userId: String,
  name: String,
  weight: Number,
  ingredients: [ProductIngredientSchema],
  totalCost: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', ProductSchema); 