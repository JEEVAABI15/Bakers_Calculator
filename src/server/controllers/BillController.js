import Bill from '../models/Bill.js';

export const BillController = {
  async getAll(req, res) {
    const bills = await Bill.find({ userId: req.userId });
    res.json(bills);
  },
  async create(req, res) {
    try {
      const bill = await Bill.create({ ...req.body, userId: req.userId });
      res.status(201).json(bill);
    } catch (err) {
      res.status(400).json({ message: 'Create failed', error: err });
    }
  },
  async update(req, res) {
    try {
      const bill = await Bill.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!bill) return res.status(404).json({ message: 'Not found' });
      res.json(bill);
    } catch (err) {
      res.status(400).json({ message: 'Update failed', error: err });
    }
  },
  async remove(req, res) {
    try {
      const bill = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.userId });
      if (!bill) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ message: 'Delete failed', error: err });
    }
  }
}; 