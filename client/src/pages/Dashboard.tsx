import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employees: 0, timeOff: 0, payroll: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // We know /api/employees works because of your console log!
        const empRes = await axios.get('/api/employees');
        
        // Let's also fetch time-off and payroll
        const [leaveRes, payrollRes] = await Promise.all([
          axios.get('/api/time-off').catch(() => ({ data: [] })),
          axios.get('/api/payroll').catch(() => ({ data: [] }))
        ]);

        setStats({
          employees: empRes.data.length, // This should now show 4
          timeOff: leaveRes.data.length,
          payroll: payrollRes.data.length
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Active Employees</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{loading ? '...' : stats.employees}</p>
        </div>
        {/* ... other cards ... */}
      </div>
    </div>
  );
};