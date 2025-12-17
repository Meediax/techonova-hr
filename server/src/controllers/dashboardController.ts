import { Request, Response } from 'express';
import { query } from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user.companyId;

    console.log('--- DASHBOARD DEBUG ---');
    console.log('1. User Company ID:', companyId);

    // 1. Count Employees
    const empQuery = query(
      `SELECT COUNT(*) FROM employees WHERE company_id = $1 AND status = 'Active'`, 
      [companyId]
    );

    // 2. Count Pending Leaves
    const leaveQuery = query(
      `SELECT COUNT(*) FROM leave_requests WHERE company_id = $1 AND status = 'Pending'`, 
      [companyId]
    );

    // 3. Sum Total Salaries
    const payrollQuery = query(
      `SELECT SUM(amount) as total FROM compensations WHERE company_id = $1`, 
      [companyId]
    );

    const [empRes, leaveRes, payRes] = await Promise.all([empQuery, leaveQuery, payrollQuery]);

    console.log('2. Payroll Query Result:', payRes.rows[0]); // <--- See what DB returns
    console.log('-------------------------');

    const totalAnnual = parseFloat(payRes.rows[0].total || '0');
    
    res.json({
      totalEmployees: parseInt(empRes.rows[0].count),
      pendingLeaves: parseInt(leaveRes.rows[0].count),
      estimatedPayroll: Math.round(totalAnnual / 12)
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};