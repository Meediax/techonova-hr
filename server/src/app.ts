import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
// ... other imports
import dashboardRoutes from './routes/dashboardRoutes';
import leaveRoutes from './routes/leaveRoutes';
import payrollRoutes from './routes/payrollRoutes';
import path from 'path';

const app: Application = express();

// --- 1. Middleware ---
app.use(cors()); // Allow different ports to talk (useful during dev)
app.use(express.json()); // CRITICAL: Allows app to understand JSON in POST body

// 👇 ADD THIS LINE to serve images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 2. Routes ---
// Mount the Auth routes at /api/auth
// Example: This makes POST /api/auth/login work
app.use('/api/auth', authRoutes);

// Placeholder for future routes
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// --- 3. Health Check Route ---
// A simple endpoint to test if the server is breathing
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running.' });
});

export default app;