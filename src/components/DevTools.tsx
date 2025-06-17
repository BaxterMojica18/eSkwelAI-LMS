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
  Database,
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { createTestAuthUsers, checkExistingUsers, cleanupTestUsers, testUsers } from '../utils/createTestUsers';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [checkResults, setCheckResults] = useState<any[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);

  const handleCreateUsers = async () => {
    setLoading(true);
    setActiveOperation('create');
    setResults([]);
    
    try {
      const creationResults = await createTestAuthUsers();
      setResults(creationResults);
    } catch (error) {
      console.error('Error creating users:', error);
      setResults([{ email: 'System Error', success: false, error: 'Unexpected error occurred' }]);
    } finally {
      setLoading(false);
      setActiveOperation(null);
    }
  };

  const handleCheckUsers = async () => {
    setLoading(true);
    setActiveOperation('check');
    setCheckResults([]);
    
    try {
      const checkResults = await checkExistingUsers();
      setCheckResults(checkResults);
    } catch (error) {
      console.error('Error checking users:', error);
      setCheckResults([{ email: 'System Error', profileExists: false, authExists: false, error: 'Unexpected error occurred' }]);
    } finally {
      setLoading(false);
      setActiveOperation(null);
    }
  };

  const handleCleanupUsers = async () => {
    if (!confirm('Are you sure you want to delete all test users? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setActiveOperation('cleanup');
    setResults([]);
    
    try {
      const cleanupResults = await cleanupTestUsers();
      setResults(cleanupResults);
    } catch (error) {
      console.error('Error cleaning up users:', error);
      setResults([{ email: 'System Error', success: false, error: 'Unexpected error occurred' }]);
    } finally {
      setLoading(false);
      setActiveOperation(null);
    }
  };

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`);
  };

  const copyAllCredentials = () => {
    const allCreds = testUsers.map(user => `${user.role}: ${user.email} / ${user.password}`).join('\n');
    navigator.clipboard.writeText(allCreds);
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
    <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-lg w-full z-50 max-h-[80vh] overflow-y-auto">
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
        {/* Service Role Key Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800">
              <p className="font-medium mb-1">Service Role Key Required</p>
              <p>Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_SERVICE_ROLE_KEY</code> to your .env file to create auth users.</p>
            </div>
          </div>
        </div>

        {/* Test User Management */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Test User Management</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={handleCreateUsers}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
            >
              {loading && activeOperation === 'create' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Create Users</span>
                </>
              )}
            </button>

            <button
              onClick={handleCheckUsers}
              disabled={loading}
              className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
            >
              {loading && activeOperation === 'check' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span>Check Status</span>
                </>
              )}
            </button>

            <button
              onClick={handleCleanupUsers}
              disabled={loading}
              className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm col-span-2"
            >
              {loading && activeOperation === 'cleanup' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cleaning...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Cleanup All Users</span>
                </>
              )}
            </button>
          </div>

          {/* Creation Results */}
          {results.length > 0 && (
            <div className="space-y-2 mb-4">
              <h5 className="text-sm font-medium text-gray-700">
                {activeOperation === 'cleanup' ? 'Cleanup Results:' : 'Creation Results:'}
              </h5>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {results.map((result, index) => (
                  <div key={index} className={`flex items-start space-x-2 text-xs p-2 rounded ${
                    result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {result.success ? (
                      <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{result.email}</div>
                      {result.error && (
                        <div className="text-xs opacity-75 break-words">{result.error}</div>
                      )}
                      {result.message && (
                        <div className="text-xs opacity-75">{result.message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check Results */}
          {checkResults.length > 0 && (
            <div className="space-y-2 mb-4">
              <h5 className="text-sm font-medium text-gray-700">Status Check:</h5>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {checkResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <span className="font-medium">{result.email}</span>
                    <div className="flex items-center space-x-1">
                      <span className={`px-1 rounded ${result.profileExists ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Profile: {result.profileExists ? '✓' : '✗'}
                      </span>
                      <span className={`px-1 rounded ${
                        result.authExists === true ? 'bg-green-100 text-green-700' : 
                        result.authExists === false ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        Auth: {result.authExists === true ? '✓' : result.authExists === false ? '✗' : '?'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Test Credentials */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Test Credentials</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyAllCredentials}
                className="text-gray-600 hover:text-gray-800 text-xs"
                title="Copy all credentials"
              >
                Copy All
              </button>
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-gray-600 hover:text-gray-800"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
            {testUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 capitalize">{user.role}</div>
                  <div className="text-gray-600 text-xs truncate">{user.email}</div>
                  {showPasswords && (
                    <div className="text-gray-500 font-mono text-xs">{user.password}</div>
                  )}
                </div>
                <button
                  onClick={() => copyCredentials(user.email, user.password)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
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
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-900 mb-1">Quick Start:</h5>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. Add service role key to .env file</li>
                <li>2. Click "Create Users" to set up auth</li>
                <li>3. Use credentials above to log in</li>
                <li>4. Each role shows different features</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;