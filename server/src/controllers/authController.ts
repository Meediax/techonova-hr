import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db'; // The DB connection wrapper we set up earlier

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Find the user in the database
    // We select the password_hash specifically here because we need it for the check
    const userResult = await query(
      `SELECT id, first_name, last_name, email, password_hash, role, company_id 
       FROM employees 
       WHERE email = $1`, 
      [email]
    );

    const user = userResult.rows[0];

    // 3. Security Check: Does the user exist?
    if (!user) {
      // PRO TIP: Don't say "User not found." Say "Invalid credentials."
      // This prevents hackers from fishing for valid email addresses.
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Security Check: Does the password match?
    // We use bcrypt to compare the plain text password with the encrypted hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 5. Generate the JWT Token
    // This is the payload we defined in authMiddleware.ts
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      companyId: user.company_id,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '8h' } // Token expires in 8 hours (standard work day)
    );

    // 6. Send response (Remove sensitive data first)
    // Never send the password hash back to the client!
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        role: user.role,
        company_id: user.company_id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};