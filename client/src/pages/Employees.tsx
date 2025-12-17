import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { CreateEmployeeModal } from '../components/CreateEmployeeModal'; // <--- Import Component

export const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- New State

  // Reuse the fetch function so we can call it after adding a user
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setError('Server returned invalid data.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        {/* Update Button to open modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-700">Name</th>
              <th className="px-6 py-4 font-medium text-gray-700">Role</th>
              <th className="px-6 py-4 font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
               <tr><td colSpan={3} className="p-6 text-center text-gray-500">No employees found.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{emp.first_name} {emp.last_name}</div>
                    <div className="text-gray-500 text-xs">{emp.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{emp.job_title}</div>
                    <div className="text-xs text-gray-500">{emp.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RENDER THE MODAL */}
      <CreateEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees} // Refresh list after success
      />
    </div>
  );
};