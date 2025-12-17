import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import path from 'path';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user.companyId;
    const result = await query(
      `SELECT id, first_name, last_name, email, role, job_title, status, profile_picture 
       FROM employees 
       WHERE company_id = $1 
       ORDER BY created_at DESC`,
      [companyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  const { first_name, last_name, email, job_title, role } = req.body;
  
  try {
    const companyId = (req as any).user.companyId;

    // 1. Check if email exists
    const userExists = await query('SELECT id FROM employees WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Find a default department (Fallback)
    const deptResult = await query(
        'SELECT id FROM departments WHERE company_id = $1 LIMIT 1', 
        [companyId]
    );
    const departmentId = deptResult.rows.length > 0 ? deptResult.rows[0].id : null;

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('welcome123', salt);

    // 4. Insert (Added start_date here!)
    const result = await query(
      `INSERT INTO employees 
      (company_id, first_name, last_name, email, password_hash, job_title, role, status, department_id, start_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active', $8, NOW())
      RETURNING id, first_name, last_name, email, role, job_title, status`,
      [companyId, first_name, last_name, email, hashedPassword, job_title, role, departmentId]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Server error creating employee' });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = (req as any).user.userId;
    
    // We construct the public URL for the image
    // e.g., http://localhost:3000/uploads/avatar-123.jpg
    const photoUrl = `/uploads/${req.file.filename}`;

    // Update the database
    await query(
      'UPDATE employees SET profile_picture = $1 WHERE id = $2',
      [photoUrl, userId]
    );

    res.json({ message: 'Upload successful', photoUrl });

  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};