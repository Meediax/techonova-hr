import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, Save } from 'lucide-react';

export const Payroll = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track which row is being edited: { 'userId': '50000' }
  const [edits, setEdits] = useState<Record<string, string>>({});

  const fetchPayroll = async () => {
    try {
      const res = await axios.get('/api/payroll');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleSave = async (id: string) => {
    const amount = edits[id];
    if (!amount) return; // No change

    try {
      await axios.post('/api/payroll/update', {
        employee_id: id,
        amount: parseFloat(amount),
        currency: 'USD'
      });
      alert('Salary updated!');
      fetchPayroll(); // Refresh to see formatted data
      // Clear edit state for this row
      const newEdits = { ...edits };
      delete newEdits[id];
      setEdits(newEdits);
    } catch (err) {
      alert('Failed to save');
    }
  };

  if (loading) return <div className="p-10">Loading payroll data...</div>;

  return (
    <div className="space-y-6 p-4 md:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-700">Employee</th>
              <th className="px-6 py-4 font-medium text-gray-700">Job Title</th>
              <th className="px-6 py-4 font-medium text-gray-700">Annual Salary (USD)</th>
              <th className="px-6 py-4 font-medium text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {emp.first_name} {emp.last_name}
                </td>
                <td className="px-6 py-4 text-gray-500">{emp.job_title}</td>
                <td className="px-6 py-4">
                  <div className="relative max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      // If being edited, show edit value, else show DB value
                      value={edits[emp.id] !== undefined ? edits[emp.id] : emp.salary}
                      onChange={(e) => setEdits({ ...edits, [emp.id]: e.target.value })}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {edits[emp.id] !== undefined && (
                    <button 
                      onClick={() => handleSave(emp.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      <Save className="w-3 h-3 mr-1" /> Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};