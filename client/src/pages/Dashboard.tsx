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
        const [empRes, leaveRes, payrollRes] = await Promise.all([
          axios.get('/api/employees'),
          axios.get('/api/time-off'),
          axios.get('/api/payroll')
        ]);

        setStats({
          employees: Array.isArray(empRes.data) ? empRes.data.length : 0,
          timeOff: Array.isArray(leaveRes.data) ? leaveRes.data.length : 0,
          payroll: Array.isArray(payrollRes.data) ? payrollRes.data.length : 0
        });
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Active Employees', value: stats.employees, icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Pending Leave', value: stats.timeOff, icon: <Calendar className="text-orange-600" />, color: 'bg-orange-50' },
    { label: 'Upcoming Payroll', value: stats.payroll, icon: <CreditCard className="text-green-600" />, color: 'bg-green-50' }
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg text-white">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};