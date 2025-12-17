import { Request, Response } from 'express';
import { query } from '../config/db';

// 1. Get current user's leave history
export const getMyLeaves = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const result = await query(
      `SELECT * FROM leave_requests 
       WHERE employee_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaves:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Submit a new request
export const createLeaveRequest = async (req: Request, res: Response) => {
  const { start_date, end_date, reason, type } = req.body;
  
  try {
    const userId = (req as any).user.userId;
    const companyId = (req as any).user.companyId;

    // Insert the request
    const result = await query(
      `INSERT INTO leave_requests 
       (company_id, employee_id, start_date, end_date, reason, status, leave_type)
       VALUES ($1, $2, $3, $4, $5, 'Pending', $6)
       RETURNING *`,
      [companyId, userId, start_date, end_date, reason, type]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Error creating leave request:', err);
    res.status(500).json({ message: 'Server error creating leave request' });
  }
};

// 3. Get ALL requests for the company (with employee names!)
export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user.companyId;
    
    // Join with employees table so we know WHO is asking
    const result = await query(
      `SELECT lr.*, e.first_name, e.last_name, e.email 
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       WHERE lr.company_id = $1 
       ORDER BY lr.created_at DESC`,
      [companyId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all leaves:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Approve or Reject a request
export const updateLeaveStatus = async (req: Request, res: Response) => {
  const { id } = req.params; // The leave request ID
  const { status } = req.body; // 'Approved' or 'Rejected'
  
  try {
    const result = await query(
      `UPDATE leave_requests 
       SET status = $1 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating leave:', err);
    res.status(500).json({ message: 'Server error' });
  }
};