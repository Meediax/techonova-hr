import { Router } from 'express';
import { getPayrollList, updateSalary } from '../controllers/payrollController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getPayrollList);
router.post('/update', authenticateToken, updateSalary);

export default router;