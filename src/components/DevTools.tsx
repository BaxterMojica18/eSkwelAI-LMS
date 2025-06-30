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
  AlertTriangle,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DevTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      if (!isSupabaseConfigured || !supabase) {
        setTestResult('❌ Supabase not configured. Please set up your environment variables.');
        return;
      }

      // Test basic connection with a simple query
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count', { count: 'exact', head: true });

      if (error) {
        setTestResult(`❌ Database Error: ${error.message}`);
      } else {
        setTestResult(`✅ Database connected successfully. Found ${data || 0} user profiles.`);
      }
    } catch (error: any) {
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testTrigger = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      if (!isSupabaseConfigured || !supabase) {
        setTestResult('❌ Supabase not configured.');
        return;
      }

      // Test if the trigger function exists
      const { data, error } = await supabase.rpc('check_function_exists', { function_name: 'handle_new_user' });

      if (error) {
        setTestResult(`❌ Could not check trigger function: ${error.message}. The migration may not be applied yet.`);
      } else if (data) {
        setTestResult('✅ Database setup appears to be working. Try creating a new account.');
      } else {
        setTestResult('⚠️ Trigger function not found. Please run the holy_sea migration in your Supabase SQL editor.');
      }
    } catch (error: any) {
      setTestResult(`❌ Trigger test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthSession = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
        setTestResult('✅ Session cleared successfully');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setTestResult('❌ Supabase not available');
      }
    } catch (error: any) {
      setTestResult(`❌ Error clearing session: ${error.message}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-32 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Open Dev Tools"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-32 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-lg w-full z-50 max-h-[80vh] overflow-y-auto">
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
        {/* Configuration Status */}
        <div className={`border rounded-lg p-3 ${
          isSupabaseConfigured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start space-x-2">
            {isSupabaseConfigured ? (
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="text-xs">
              <p className={`font-medium mb-1 ${
                isSupabaseConfigured ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {isSupabaseConfigured ? 'Supabase Configured' : 'Supabase Not Configured'}
              </p>
              <p className={isSupabaseConfigured ? 'text-green-800' : 'text-yellow-800'}>
                {isSupabaseConfigured 
                  ? 'Environment variables are set and Supabase client is initialized.'
                  : 'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Database Test */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Database Connection</span>
          </h4>
          
          <div className="space-y-2">
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
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

            <button
              onClick={testTrigger}
              disabled={loading || !isSupabaseConfigured}
              className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Test Setup</span>
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div className="text-sm p-2 bg-gray-50 rounded border mt-3 whitespace-pre-wrap">
              {testResult}
            </div>
          )}
        </div>

        {/* Auth Management */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Session Management</h4>
          
          <button
            onClick={clearAuthSession}
            className="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear Session & Reload
          </button>
        </div>

        {/* Migration Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-900 mb-1">Setup Instructions:</h5>
              <ol className="text-xs text-blue-800 space-y-1">
                <li>1. Copy SQL from <code className="bg-blue-100 px-1 rounded">supabase/migrations/20250630034146_holy_sea.sql</code></li>
                <li>2. Run it in your Supabase SQL editor</li>
                <li>3. Test the connection above</li>
                <li>4. Try creating a new account</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-gray-900 mb-1">Environment Status:</h5>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>✅ Frontend: React + TypeScript</li>
            <li>{isSupabaseConfigured ? '✅' : '❌'} Supabase: {isSupabaseConfigured ? 'Connected' : 'Not configured'}</li>
            <li>✅ Authentication: {isSupabaseConfigured ? 'Supabase Auth' : 'Disabled'}</li>
            <li>✅ Database: {isSupabaseConfigured ? 'PostgreSQL via Supabase' : 'Not available'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DevTools;