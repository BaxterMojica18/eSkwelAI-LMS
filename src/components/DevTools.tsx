import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Info,
  AlertTriangle
} from 'lucide-react';
import { checkExistingUsers, testUsers } from '../utils/createTestUsers';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkResults, setCheckResults] = useState<any[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleCheckUsers = async () => {
    setLoading(true);
    setCheckResults([]);
    
    try {
      const checkResults = await checkExistingUsers();
      setCheckResults(checkResults);
    } catch (error) {
      console.error('Error checking users:', error);
      setCheckResults([{ email: 'System Error', profileExists: false, authExists: false, error: 'Unexpected error occurred' }]);
    } finally {
      setLoading(false);
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
        {/* Manual Creation Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Manual User Creation</p>
              <p>Create test users manually in Supabase Dashboard using the credentials below.</p>
            </div>
          </div>
        </div>

        {/* User Status Check */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>User Status Check</span>
          </h4>
          
          <button
            onClick={handleCheckUsers}
            disabled={loading}
            className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Check User Status</span>
              </>
            )}
          </button>

          {/* Check Results */}
          {checkResults.length > 0 && (
            <div className="space-y-2">
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

        {/* Manual Creation Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-amber-900 mb-1">Manual Setup Required:</h5>
              <ol className="text-xs text-amber-800 space-y-1">
                <li>1. Go to Supabase Dashboard → Authentication</li>
                <li>2. Click "Add User" for each credential above</li>
                <li>3. Use the exact email/password combinations</li>
                <li>4. Set "Email Confirmed" to true</li>
                <li>5. Test login using the Database User Checker</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;