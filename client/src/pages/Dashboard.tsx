import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    estimatedPayroll: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load dashboard stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Employees */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEmployees}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active Team Members</span>
          </div>
        </div>

        {/* Card 2: Pending Leaves */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Leave</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingLeaves}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Requests needing approval
          </div>
        </div>

        {/* Card 3: Payroll (Placeholder for now) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Payroll</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                ${stats.estimatedPayroll.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Monthly estimate
          </div>
        </div>
      </div>
    </div>
  );
};