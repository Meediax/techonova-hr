import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, Calendar, CreditCard, Activity } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employees: 0, timeOff: 0, payroll: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel from your endpoints
        const [empRes, leaveRes, payrollRes] = await Promise.all([
          axios.get('/api/employees').catch(() => ({ data: [] })),
          axios.get('/api/time-off').catch(() => ({ data: [] })),
          axios.get('/api/payroll').catch(() => ({ data: [] }))
        ]);
        
        setStats({
          employees: Array.isArray(empRes.data) ? empRes.data.length : 0,
          timeOff: Array.isArray(leaveRes.data) ? leaveRes.data.length : 0,
          payroll: Array.isArray(payrollRes.data) ? payrollRes.data.length : 0
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); 

  // Data structure to make rendering the cards cleaner
  const statCards = [
    {
      label: 'Total Employees',
      value: stats.employees,
      icon: <Users size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pending Leave',
      value: stats.timeOff,
      icon: <Calendar size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Payroll Runs',
      value: stats.payroll,
      icon: <CreditCard size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-200">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.email || 'Admin'}</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl ${card.bgColor} ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <span className="animate-pulse text-gray-300">...</span>
                ) : (
                  card.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity or Charts */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 border-dashed flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Activity size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">System Ready</h3>
          <p className="text-gray-500 max-w-xs mx-auto text-sm">
            All systems are operational. Navigate through the menu to manage employees, leave, and payroll.
          </p>
        </div>
      </div>
    </div>
  );
};