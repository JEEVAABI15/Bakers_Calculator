import InventoryItem from '../models/InventoryItem.js';

export const InventoryController = {
  async getAll(req, res) {
    const items = await InventoryItem.find({ userId: req.userId });
    res.json(items);
  },
  async create(req, res) {
    try {
      const item = await InventoryItem.create({ ...req.body, userId: req.userId });
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: 'Create failed', error: err });
    }
  },
  async update(req, res) {
    try {
      const item = await InventoryItem.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: 'Update failed', error: err });
    }
  },
  async remove(req, res) {
    try {
      const item = await InventoryItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Delete failed', error: err });
    }
  }
}; 