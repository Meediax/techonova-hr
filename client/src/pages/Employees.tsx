import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ 
    first_name: '', last_name: '', email: '', role: 'Employee' 
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees');
      console.log("Fetched Employees:", res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // Use this to test if the button even works
  const openModal = () => {
    console.log("Opening Modal...");
    setIsModalOpen(true);
  };

  const { user } = useAuth(); // Make sure you import useAuth

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add the company_id from the logged-in user to the request
      const employeeData = {
        ...newEmployee,
        company_id: user?.companyId // Or user?.company_id depending on your token payload
      };
      
      await axios.post('/api/employees', employeeData);
      setIsModalOpen(false);
      fetchEmployees(); 
    } catch (err) {
      console.error("POST Error:", err);
      alert("Failed to save employee. Check if company_id is missing.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee List</h1>
        <button 
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp: any) => (
                <tr key={emp.id} className="border-b">
                  <td className="px-6 py-4">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.role}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="p-10 text-center text-gray-400">No data found. Click Add to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Employee</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <input required placeholder="First Name" className="w-full border p-2 rounded" 
                onChange={e => setNewEmployee({...newEmployee, first_name: e.target.value})} />
              <input required placeholder="Last Name" className="w-full border p-2 rounded" 
                onChange={e => setNewEmployee({...newEmployee, last_name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full border p-2 rounded" 
                onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Save Employee</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};