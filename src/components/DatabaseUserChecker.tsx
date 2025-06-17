import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  Copy,
  Loader2,
  AlertCircle,
  Info
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
  metadata: any;
}

const DatabaseUserChecker: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  // Expected test credentials
  const expectedCredentials = {
    'developer@eskwelai.com': 'DevPass123!',
    'teacher@eskwelai.com': 'TeachPass123!',
    'student@eskwelai.com': 'StudentPass123!',
    'parent@eskwelai.com': 'ParentPass123!',
    'accounting@eskwelai.com': 'AccountPass123!'
  };

  useEffect(() => {
    fetchTestUsers();
  }, []);

  const fetchTestUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get the test accounts view
      const { data: testAccounts, error: viewError } = await supabase
        .from('test_accounts')
        .select('*');

      if (!viewError && testAccounts && testAccounts.length > 0) {
        console.log('✅ Found test accounts via view:', testAccounts);
        setUsers(testAccounts);
      } else {
        // Fallback: query user_profiles directly
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('email', Object.keys(expectedCredentials))
          .order('created_at', { ascending: false });

        if (profileError) {
          throw profileError;
        }

        console.log('✅ Found user profiles:', profiles);
        setUsers(profiles || []);
      }
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`);
    console.log(`📋 Copied: ${email} / ${password}`);
  };

  const copyAllCredentials = () => {
    const allCreds = users.map(user => {
      const password = expectedCredentials[user.email as keyof typeof expectedCredentials] || 'Unknown';
      return `${user.role}: ${user.email} / ${password}`;
    }).join('\n');
    navigator.clipboard.writeText(allCreds);
    console.log('📋 Copied all credentials');
  };

  const testLogin = async (email: string, password: string) => {
    try {
      console.log(`🔐 Testing login for ${email}...`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error(`❌ Login failed for ${email}:`, error.message);
        alert(`Login failed for ${email}: ${error.message}`);
      } else {
        console.log(`✅ Login successful for ${email}:`, data);
        alert(`✅ Login successful for ${email}! Check console for details.`);
        
        // Sign out immediately to avoid conflicts
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      console.error(`❌ Login error for ${email}:`, err);
      alert(`Login error for ${email}: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Checking database for test users...</span>
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
          onClick={fetchTestUsers}
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
            <h2 className="text-xl font-bold text-gray-900">Database Test Users</h2>
            <p className="text-gray-600">Found {users.length} test user profiles</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyAllCredentials}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Copy All
          </button>
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-gray-600 hover:text-gray-800"
          >
            {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
          <button
            onClick={fetchTestUsers}
            className="text-gray-600 hover:text-gray-800"
          >
            <Database className="h-5 w-5" />
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Users Found</h3>
          <p className="text-gray-600">No test user profiles found in the database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Login Status</h3>
                <p className="text-blue-800 text-sm mb-2">
                  Found {users.length} user profiles. To log in, you need both a profile AND an auth user.
                </p>
                <p className="text-blue-700 text-xs">
                  If login fails, the auth users may not be created yet. Use the DevTools to create them.
                </p>
              </div>
            </div>
          </div>

          {/* User Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {users.map((user) => {
              const password = expectedCredentials[user.email as keyof typeof expectedCredentials] || 'Unknown';
              const hasMetadata = user.metadata && Object.keys(user.metadata).length > 0;
              
              return (
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

                  {/* Credentials */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Login Credentials</span>
                      <button
                        onClick={() => copyCredentials(user.email, password)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy credentials"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-mono text-gray-800">{user.email}</div>
                      {showPasswords ? (
                        <div className="font-mono text-gray-600">{password}</div>
                      ) : (
                        <div className="font-mono text-gray-400">••••••••••</div>
                      )}
                    </div>
                  </div>

                  {/* Test Login Button */}
                  <button
                    onClick={() => testLogin(user.email, password)}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Test Login
                  </button>

                  {/* Metadata */}
                  {hasMetadata && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <details className="text-xs">
                        <summary className="text-gray-600 cursor-pointer hover:text-gray-800">
                          Profile Metadata
                        </summary>
                        <pre className="mt-2 text-gray-500 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(user.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}

                  {/* Profile Info */}
                  <div className="mt-2 text-xs text-gray-500">
                    <div>ID: {user.id}</div>
                    <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-2">Ready to Test!</h3>
                <div className="text-green-800 text-sm space-y-1">
                  <p>✅ User profiles are created in the database</p>
                  <p>🔐 Try logging in with the credentials above</p>
                  <p>🎯 Each role will show different dashboard features</p>
                  <p>⚙️ Use DevTools (gear icon) if login fails</p>
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