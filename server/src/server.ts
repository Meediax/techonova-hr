// ---------------------------------------------------------
// CRITICAL FIX: Ignore SSL errors for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// ---------------------------------------------------------

import app from './app';
import dotenv from 'dotenv'; // or import * as dotenv depending on your setup

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`   - Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   - Auth Route:   http://localhost:${PORT}/api/auth/login`);
});