import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { InventoryController } from '../controllers/InventoryController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', InventoryController.getAll);
router.post('/', InventoryController.create);
router.put('/:id', InventoryController.update);
router.delete('/:id', InventoryController.remove);

export default router; 