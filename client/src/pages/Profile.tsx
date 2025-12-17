import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Briefcase, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user: authUser } = useAuth(); // Get the logged-in token data
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/employees');
        const allEmployees = res.data;
        
        console.log("--- DEBUG PROFILE MATCH ---");
        console.log("1. Logged in User (AuthContext):", authUser);
        console.log("2. Employee List from DB:", allEmployees);

        if (allEmployees.length > 0) {
          // STRATEGY 1: Match by ID (Best)
          // Checks if the DB 'id' matches the token 'userId' or 'id'
          let match = allEmployees.find((emp: any) => 
            emp.id === authUser?.userId || emp.id === authUser?.id
          );

          // STRATEGY 2: Match by Email (Fallback)
          // If ID match fails, check email (case-insensitive)
          if (!match && authUser?.email) {
            console.log("ID match failed. Trying Email...");
            match = allEmployees.find((emp: any) => 
              emp.email.toLowerCase() === authUser.email.toLowerCase()
            );
          }

          if (match) {
            console.log("✅ MATCH FOUND:", match);
            setUser(match);
          } else {
            console.warn("❌ NO MATCH FOUND. Showing first user as fallback.");
            setUser(allEmployees[0]); // Fallback to avoid empty screen
          }
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    if (authUser) {
      fetchMe();
    }
  }, [authUser]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file); // Must match backend middleware name

    setUploading(true);
    try {
      const res = await axios.post('/api/employees/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update local state instantly with new photo URL
      setUser((prev: any) => ({ ...prev, profile_picture: res.data.photoUrl }));
      alert('Photo updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="p-10 text-gray-500">Loading profile data...</div>;

  return (
    <div className="p-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Colorful Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden flex items-center justify-center shadow-md">
                {user.profile_picture ? (
                  <img 
                    // Logic: If url starts with http, use it. If not, prepend localhost:3000
                    src={user.profile_picture.startsWith('http') 
                      ? user.profile_picture 
                      : `http://localhost:3000${user.profile_picture}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              
              {/* Camera Icon Overlay */}
              <label className={`absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-50 border border-gray-200 transition-transform hover:scale-105 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Camera className="w-5 h-5 text-gray-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="mb-2">
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm">
                  Edit Details
                </button>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.first_name} {user.last_name}</h2>
              <p className="text-lg text-blue-600 font-medium">{user.job_title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 mt-6">
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};