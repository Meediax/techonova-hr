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
        // Fetch your real counts from the backend
        const [empRes, leaveRes] = await Promise.all([
          axios.get('/api/employees'),
          axios.get('/api/time-off/pending') // adjust paths to match your actual backend routes
        ]);
        
        setStats({
          employees: empRes.data.length || 0,
          timeOff: leaveRes.data.length || 0,
          payroll: 0 // Placeholder until payroll is set up
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h1>
        <p className="text-gray-500">System overview and quick actions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Active Employees</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {loading ? '...' : stats.employees}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Pending Leave</h3>
          <p className="text-3xl font-bold mt-2 text-orange-500">
            {loading ? '...' : stats.timeOff}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Upcoming Payroll</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {loading ? '...' : stats.payroll}
          </p>
        </div>
      </div>
    </div>
  );
};