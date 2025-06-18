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
import { supabase } from '../lib/supabase';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test basic database connection
      const { data, error } = await supabase
        .from('schools')
        .select('count')
        .limit(1);

      if (error) {
        setTestResult(`❌ Database Error: ${error.message}`);
      } else {
        setTestResult('✅ Database connection successful!');
      }
    } catch (error: any) {
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthSession = async () => {
    try {
      await supabase.auth.signOut();
      setTestResult('✅ Auth session cleared');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      setTestResult(`❌ Error clearing session: ${error.message}`);
    }
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
        {/* Clean Signup Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-800">
              <p className="font-medium mb-1">Clean Signup System</p>
              <p>Users can now register with email/password and choose their role during signup.</p>
            </div>
          </div>
        </div>

        {/* Database Test */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Database Connection</span>
          </h4>
          
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm mb-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Test Connection</span>
              </>
            )}
          </button>

          {testResult && (
            <div className="text-sm p-2 bg-gray-50 rounded border">
              {testResult}
            </div>
          )}
        </div>

        {/* Auth Management */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Authentication</h4>
          
          <button
            onClick={clearAuthSession}
            className="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear Auth Session
          </button>
        </div>

        {/* Signup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-900 mb-1">How to Use:</h5>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. Click "Login" in the header</li>
                <li>2. Switch to "Create Account" tab</li>
                <li>3. Fill in your details and choose your role</li>
                <li>4. Sign up and start using the system</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Available Roles */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Available Roles:</h5>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Developer</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Teacher</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Student</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Parent</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Admin</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Accounting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;