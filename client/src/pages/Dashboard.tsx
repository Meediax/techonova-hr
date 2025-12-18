import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.email}</h1>
        <p className="text-gray-500">System overview and quick actions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Active Employees</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">--</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Pending Leave</h3>
          <p className="text-3xl font-bold mt-2 text-orange-500">--</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium uppercase">Upcoming Payroll</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">--</p>
        </div>
      </div>
    </div>
  );
};