import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, Calendar, CreditCard } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employees: 0, timeOff: 0, payroll: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // We call the endpoint that we KNOW works from your console logs
        const empRes = await axios.get('/api/employees');
        
        // This will now count ALL employees in that table (should be 5)
        setStats({
          employees: Array.isArray(empRes.data) ? empRes.data.length : 0,
          timeOff: 0, // Set to 0 for now until those routes are fixed
          payroll: 0
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Removed [user] dependency to ensure it loads regardless of ID sync

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">Total Employees</p>
            <p className="text-3xl font-bold">{loading ? '...' : stats.employees}</p>
          </div>
        </div>
        {/* ... (Other cards) ... */}
      </div>
    </div>
  );
};