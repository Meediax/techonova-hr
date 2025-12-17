import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

export const TimeOff = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [allLeaves, setAllLeaves] = useState<any[]>([]); // For Admins
  const [view, setView] = useState<'my' | 'team'>('my'); // Toggle view
  const [isAdmin, setIsAdmin] = useState(false); // Simple check

  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    type: 'Vacation',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  // Load Data
  const fetchData = async () => {
    try {
      // 1. Get my leaves
      const myRes = await axios.get('/api/leaves/my-leaves');
      setLeaves(myRes.data);

      // 2. Try to get ALL leaves (only works if Admin)
      // We wrap this in a try/catch so it doesn't crash for normal users
      try {
        const allRes = await axios.get('/api/leaves/all');
        setAllLeaves(allRes.data);
        setIsAdmin(true); // If this succeeds, we are an admin/manager!
      } catch (err) {
        setIsAdmin(false);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/leaves/request', formData);
      fetchData(); 
      setFormData({ start_date: '', end_date: '', type: 'Vacation', reason: '' });
      alert('Request submitted!');
    } catch (err) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/api/leaves/${id}/status`, { status: newStatus });
      fetchData(); // Refresh list to see the change
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Time Off Management</h1>
        
        {/* Toggle for Admins */}
        {isAdmin && (
          <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
            <button 
              onClick={() => setView('my')}
              className={`px-4 py-2 rounded-md transition-all ${view === 'my' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              My Requests
            </button>
            <button 
              onClick={() => setView('team')}
              className={`px-4 py-2 rounded-md transition-all ${view === 'team' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Team Requests
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: MY REQUESTS (Original Layout) */}
      {view === 'my' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Request Time Off
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* (Keep form exactly as before) */}
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select 
                  className="w-full border rounded-lg p-2"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                    <input type="date" required className="w-full border rounded-lg p-2"
                      value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                    <input type="date" required className="w-full border rounded-lg p-2"
                      value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
              </div>
              <textarea required className="w-full border rounded-lg p-2" rows={3} placeholder="Reason..."
                value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>

          {/* My History List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4">My Request History</h2>
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div key={leave.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-bold text-gray-900">{leave.leave_type}</div>
                    <div className="text-sm text-gray-500">{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TEAM REQUESTS (Admin Only) */}
      {view === 'team' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Team Requests Inbox</h2>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-700">Employee</th>
                <th className="px-6 py-4 font-medium text-gray-700">Type & Dates</th>
                <th className="px-6 py-4 font-medium text-gray-700">Reason</th>
                <th className="px-6 py-4 font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 font-medium text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{leave.first_name} {leave.last_name}</div>
                    <div className="text-gray-500 text-xs">{leave.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{leave.leave_type}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 italic">"{leave.reason}"</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {leave.status === 'Pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};