// ---------------------------------------------------------
// FORCE NODE TO IGNORE SSL CERTIFICATE ERRORS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// ---------------------------------------------------------

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // --- STEP 0: CLEANUP ---
    console.log('🧹 Cleaning up old test data...');
    
    const existingCompany = await pool.query(`SELECT id FROM companies WHERE subdomain = 'technova'`);
    
    if (existingCompany.rows.length > 0) {
        const coId = existingCompany.rows[0].id;
        console.log(`   Found old company ID: ${coId}`);

        // 1. Delete "Grandchild" records (Deepest dependencies)
        await pool.query(`DELETE FROM leave_requests WHERE company_id = $1`, [coId]);
        await pool.query(`DELETE FROM compensations WHERE company_id = $1`, [coId]);
        
        // 2. Delete Employees (The "Children")
        await pool.query(`DELETE FROM employees WHERE company_id = $1`, [coId]);
        
        // 3. Delete Company Settings/Rules (THIS WAS MISSING)
        await pool.query(`DELETE FROM leave_types WHERE company_id = $1`, [coId]);
        await pool.query(`DELETE FROM departments WHERE company_id = $1`, [coId]);
        
        // 4. Delete the Company (The "Parent")
        await pool.query(`DELETE FROM companies WHERE id = $1`, [coId]);
        console.log('   🗑️ Old data deleted successfully.');
    }

    // --- STEP 1: CREATE COMPANY ---
    const companyRes = await pool.query(`
      INSERT INTO companies (name, subdomain, tax_id)
      VALUES ($1, $2, $3)
      RETURNING id;
    `, ['TechNova', 'technova', '99-000000']);
    
    const companyId = companyRes.rows[0].id;
    console.log(`✅ Company created: TechNova`);

    // --- STEP 2: CREATE DEPARTMENT ---
    const deptRes = await pool.query(`
      INSERT INTO departments (company_id, name, code)
      VALUES ($1, $2, $3)
      RETURNING id;
    `, [companyId, 'Headquarters', 'HQ']);
    const deptId = deptRes.rows[0].id;

    // --- STEP 3: CREATE LEAVE TYPES (Needed for future requests) ---
    await pool.query(`
      INSERT INTO leave_types (company_id, name, allows_negative_balance, default_allowance_days)
      VALUES ($1, 'Vacation', false, 20), ($1, 'Sick Leave', true, 10)
    `, [companyId]);
    console.log(`✅ Leave Types created`);

    // --- STEP 4: CREATE ADMIN USER ---
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const userRes = await pool.query(`
      INSERT INTO employees (
        company_id, department_id, 
        first_name, last_name, email, 
        password_hash, 
        role, job_title, start_date, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, email, id as user_id;
    `, [
      companyId, 
      deptId, 
      'Admin', 'User', 'admin@technova.com', 
      passwordHash, 
      'Admin', 'System Administrator', '2023-01-01', 'Active'
    ]);

    // Add Salary
    await pool.query(`
      INSERT INTO compensations (company_id, employee_id, amount, currency, effective_date)
      VALUES ($1, $2, 80000, 'USD', '2023-01-01')
    `, [companyId, userRes.rows[0].user_id]);

    console.log(`✅ User created: ${userRes.rows[0].email}`);
    console.log(`🔑 Password: password123`);
    console.log('---------------------------------');
    console.log('🚀 Seed complete! You can now log in.');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    pool.end();
  }
};

seedDatabase();