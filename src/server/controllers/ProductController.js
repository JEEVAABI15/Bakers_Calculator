import Product from '../models/Product.js';

export const ProductController = {
  async getAll(req, res) {
    const products = await Product.find({ userId: req.userId });
    res.json(products);
  },
  async create(req, res) {
    try {
      const product = await Product.create({ ...req.body, userId: req.userId });
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: 'Create failed', error: err });
    }
  },
  async update(req, res) {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!product) return res.status(404).json({ message: 'Not found' });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: 'Update failed', error: err });
    }
  },
  async remove(req, res) {
    try {
      const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!product) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Delete failed', error: err });
    }
  }
}; 