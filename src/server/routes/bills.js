import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { BillController } from '../controllers/BillController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', BillController.getAll);
router.post('/',BillController.create);
router.put('/:id', BillController.update);
router.delete('/:id', BillController.remove);

export default router; 