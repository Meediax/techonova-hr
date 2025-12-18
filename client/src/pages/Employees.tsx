import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, X, User, Mail, Briefcase, BadgeCheck, Clock, IdentificationCard } from 'lucide-react';

export const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    role: 'Employee',
    employment_type: 'Full-time',
    job_title: '' // ✅ Job Title added to state
  });

  // Fetch logic
  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        email: newEmployee.email,
        role: newEmployee.role,
        employment_type: newEmployee.employment_type,
        job_title: newEmployee.job_title // ✅ Job Title added to payload
      };

      await axios.post('/api/employees', payload);
      
      setIsModalOpen(false);
      // Reset form including job_title
      setNewEmployee({ 
        first_name: '', last_name: '', email: '', 
        role: 'Employee', employment_type: 'Full-time', job_title: '' 
      });
      fetchEmployees(); 
    } catch (err) {
      console.error("Database Save Error:", err);
      alert("Failed to save. Your database might require a Company ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-sm text-gray-500">View and manage your organization's workforce.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md shadow-blue-100"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name & Title</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role & Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length > 0 ? (
              employees.map((emp: any) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {emp.first_name[0]}{emp.last_name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{emp.first_name} {emp.last_name}</span>
                        <span className="text-xs text-gray-500">{emp.job_title || 'No Title'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      {emp.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        <BadgeCheck size={12} className="text-blue-500" /> {emp.role}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} /> {emp.employment_type || 'Full-time'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                  No employees found. Click the button above to add your first team member.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD EMPLOYEE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full border shadow-sm">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="p-8 space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">First Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input required className="w-full border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/30" 
                      placeholder="John"
                      value={newEmployee.first_name} 
                      onChange={e => setNewEmployee({...newEmployee, first_name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Last Name</label>
                  <input required className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/30" 
                    placeholder="Doe"
                    value={newEmployee.last_name} 
                    onChange={e => setNewEmployee({...newEmployee, last_name: e.target.value})} />
                </div>
              </div>

              {/* Job Title Field ✅ */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Job Title</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input required className="w-full border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/30" 
                    placeholder="Software Engineer"
                    value={newEmployee.job_title} 
                    onChange={e => setNewEmployee({...newEmployee, job_title: e.target.value})} />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input required type="email" className="w-full border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-gray-50/30" 
                    placeholder="j.doe@company.com"
                    value={newEmployee.email} 
                    onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} />
                </div>
              </div>

              {/* Select Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Role</label>
                  <select className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50/30"
                    value={newEmployee.role}
                    onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Employment Type</label>
                  <select className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50/30"
                    value={newEmployee.employment_type}
                    onChange={e => setNewEmployee({...newEmployee, employment_type: e.target.value})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Discard
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 shadow-lg shadow-blue-100 transition-all">
                  {loading ? 'Processing...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};