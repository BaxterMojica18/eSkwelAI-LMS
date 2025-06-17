import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Database
} from 'lucide-react';
import { createTestAuthUsers, checkExistingUsers, testUsers } from '../utils/createTestUsers';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleCreateUsers = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const creationResults = await createTestAuthUsers();
      setResults(creationResults);
    } catch (error) {
      console.error('Error creating users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUsers = async () => {
    setLoading(true);
    try {
      await checkExistingUsers();
    } catch (error) {
      console.error('Error checking users:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Open Dev Tools"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-md w-full z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Dev Tools</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Test User Creation */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Test Users</span>
          </h4>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={handleCreateUsers}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Create Auth Users</span>
                </>
              )}
            </button>

            <button
              onClick={handleCheckUsers}
              disabled={loading}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Check Existing</span>
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Results:</h5>
              {results.map((result, index) => (
                <div key={index} className={`flex items-center space-x-2 text-sm p-2 rounded ${
                  result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="flex-1">{result.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Credentials */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Test Credentials</h4>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-gray-600 hover:text-gray-800"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            {testUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{user.role}</div>
                  <div className="text-gray-600">{user.email}</div>
                  {showPasswords && (
                    <div className="text-gray-500 font-mono text-xs">{user.password}</div>
                  )}
                </div>
                <button
                  onClick={() => copyCredentials(user.email, user.password)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Copy credentials"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-blue-900 mb-1">Instructions:</h5>
          <ol className="text-xs text-blue-800 space-y-1">
            <li>1. Click "Create Auth Users" to create Supabase Auth users</li>
            <li>2. Use the credentials above to log in</li>
            <li>3. Each role has different dashboard access</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DevTools;