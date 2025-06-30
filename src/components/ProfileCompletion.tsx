import React, { useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface ProfileCompletionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ isOpen, onClose, onComplete }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
    address: profile?.address || '',
    school_code: profile?.school_code || ''
  });

  // Calculate completion percentage
  const getCompletionData = () => {
    const fields = [
      { key: 'first_name', value: profile?.first_name, label: 'First Name' },
      { key: 'last_name', value: profile?.last_name, label: 'Last Name' },
      { key: 'email', value: profile?.email, label: 'Email' },
      { key: 'phone', value: formData.phone || profile?.phone, label: 'Phone' },
      { key: 'date_of_birth', value: formData.date_of_birth || profile?.date_of_birth, label: 'Date of Birth' },
      { key: 'address', value: formData.address || profile?.address, label: 'Address' },
      { key: 'school_code', value: formData.school_code || profile?.school_code, label: 'School Code' }
    ];

    const completed = fields.filter(field => field.value && field.value.trim() !== '').length;
    const total = fields.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage, fields };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async () => {
    if (!profile?.id || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address || null,
          school_code: formData.school_code || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete();
    onClose();
  };

  if (!isOpen || !profile) return null;

  const { completed, total, percentage, fields } = getCompletionData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
                <p className="text-gray-600">Help us personalize your experience</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion: {completed} of {total} fields
              </span>
              <span className="text-sm font-bold text-blue-600">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Profile Fields Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {field.value && field.value.trim() !== '' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{field.label}</span>
                    {field.value && field.value.trim() !== '' ? (
                      <p className="text-xs text-green-600">Completed</p>
                    ) : (
                      <p className="text-xs text-orange-600">Missing</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Complete Missing Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Code (Optional)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.school_code}
                  onChange={(e) => handleInputChange('school_code', e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="ABC1234"
                  maxLength={7}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your school's registration code if available
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip for now
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                {percentage < 100 ? `${100 - percentage}% remaining` : 'Profile complete!'}
              </div>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Completion Incentive */}
          {percentage < 100 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Why complete your profile?</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Get personalized recommendations</li>
                    <li>• Enable school notifications and updates</li>
                    <li>• Access all platform features</li>
                    <li>• Connect with your school community</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;