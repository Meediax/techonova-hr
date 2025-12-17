import { Request, Response } from 'express';
import { query } from '../config/db';

// 1. Get List of Employees with their current Salary
export const getPayrollList = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user.companyId;

    // We join Employees with Compensations to get the latest salary
    // (We use a LEFT JOIN because some employees might not have a salary yet)
    const result = await query(
      `SELECT e.id, e.first_name, e.last_name, e.job_title, 
              COALESCE(c.amount, 0) as salary, 
              c.currency, c.effective_date
       FROM employees e
       LEFT JOIN compensations c ON e.id = c.employee_id
       WHERE e.company_id = $1 
       ORDER BY e.last_name ASC`,
      [companyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching payroll:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Upsert (Update or Insert) Salary
export const updateSalary = async (req: Request, res: Response) => {
  const { employee_id, amount, currency } = req.body;
  const companyId = (req as any).user.companyId;

  try {
    // Check if a salary record already exists for this person
    const check = await query(
      'SELECT id FROM compensations WHERE employee_id = $1', 
      [employee_id]
    );

    if (check.rows.length > 0) {
      // UPDATE existing
      await query(
        `UPDATE compensations 
         SET amount = $1, currency = $2, effective_date = NOW() 
         WHERE employee_id = $3`,
        [amount, currency, employee_id]
      );
    } else {
      // INSERT new
      await query(
        `INSERT INTO compensations (company_id, employee_id, amount, currency, effective_date)
         VALUES ($1, $2, $3, $4, NOW())`,
        [companyId, employee_id, amount, currency]
      );
    }

    res.json({ message: 'Salary updated successfully' });
  } catch (err) {
    console.error('Error updating salary:', err);
    res.status(500).json({ message: 'Server error' });
  }
};