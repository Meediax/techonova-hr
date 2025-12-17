import { Router } from 'express';
import { getEmployees, createEmployee, uploadProfilePhoto } from '../controllers/employeeController'; // <--- Import logic
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// GET /api/employees - Get the list
router.get('/', authenticateToken, getEmployees);

// POST /api/employees - Create a new employee
router.post('/', authenticateToken, createEmployee); 

// New Route: POST /api/employees/upload-photo
// 'avatar' is the name of the form field the frontend must use
router.post('/upload-photo', authenticateToken, upload.single('avatar'), uploadProfilePhoto);

export default router;