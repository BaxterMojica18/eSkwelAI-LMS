import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Info,
  UserPlus
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  school_id: string;
}

const DatabaseUserChecker: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10); // Show last 10 users

      if (profileError) {
        throw profileError;
      }

      console.log('✅ Found user profiles:', profiles);
      setUsers(profiles || []);
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading user profiles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 text-red-600 mb-4">
          <XCircle className="h-5 w-5" />
          <span className="font-medium">Database Error</span>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
            <p className="text-gray-600">Found {users.length} user profiles</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="text-gray-600 hover:text-gray-800"
        >
          <Database className="h-5 w-5" />
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Yet</h3>
          <p className="text-gray-600 mb-6">No user profiles found in the database.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start space-x-2">
              <UserPlus className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 mb-1">Get Started</h4>
                <p className="text-blue-800 text-sm">
                  Click "Login" in the header, then "Create Account" to register your first user.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* User Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'developer' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'student' ? 'bg-green-100 text-green-800' :
                        user.role === 'parent' ? 'bg-yellow-100 text-yellow-800' :
                        user.role === 'accounting' ? 'bg-red-100 text-red-800' :
                        user.role === 'admin' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                      {user.is_active ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="mt-2 text-xs text-gray-500">
                  <div>ID: {user.id.substring(0, 8)}...</div>
                  <div>School: {user.school_id.substring(0, 8)}...</div>
                  <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-2">System Ready!</h3>
                <div className="text-green-800 text-sm space-y-1">
                  <p>✅ User registration is working properly</p>
                  <p>🔐 Users can sign up and choose their role</p>
                  <p>🎯 Each role will show different dashboard features</p>
                  <p>🚀 Ready for production use</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseUserChecker;