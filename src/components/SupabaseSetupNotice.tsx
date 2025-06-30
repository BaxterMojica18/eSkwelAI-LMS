import React from 'react'
import { AlertTriangle, ExternalLink } from 'lucide-react'

export const SupabaseSetupNotice: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase Setup Required
          </h1>
          <p className="text-gray-600">
            Your application needs to be connected to a Supabase database to function properly.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Quick Setup Steps:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Click the "Connect to Supabase" button in the top right corner</li>
              <li>Follow the setup wizard to create or connect your Supabase project</li>
              <li>Your environment variables will be automatically configured</li>
              <li>The application will reload and be ready to use</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Manual Setup (Alternative):
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>If you prefer to set up manually:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Create a new project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a></li>
                <li>Go to Settings → API in your Supabase dashboard</li>
                <li>Copy your Project URL and anon public key</li>
                <li>Update your .env file with these values</li>
              </ol>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Check Configuration Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}