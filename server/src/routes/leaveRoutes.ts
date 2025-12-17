import { Router } from 'express';
import { getMyLeaves, createLeaveRequest, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/my-leaves', authenticateToken, getMyLeaves);
router.post('/request', authenticateToken, createLeaveRequest);
router.get('/all', authenticateToken, getAllLeaves);
router.put('/:id/status', authenticateToken, updateLeaveStatus);

export default router;