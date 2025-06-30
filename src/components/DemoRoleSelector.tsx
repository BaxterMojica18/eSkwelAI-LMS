import React, { useState } from 'react';
import {
  X,
  Calculator,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';

interface DemoUser {
  id: string;
  email: string;
  role: 'accounting' | 'teacher' | 'parent' | 'student';
  first_name: string;
  last_name: string;
  school_id: string;
  description: string;
  features: string[];
}

interface DemoRoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (user: DemoUser) => void;
}

const DemoRoleSelector: React.FC<DemoRoleSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelectRole 
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const demoUsers: DemoUser[] = [
    {
      id: 'accounting-demo',
      email: 'accounting@demoschool.edu',
      role: 'accounting',
      first_name: 'Sarah',
      last_name: 'Johnson',
      school_id: 'demo-school-id',
      description: 'School Financial Manager',
      features: [
        'Student enrollment management',
        'Fee collection and tracking',
        'Financial reports and analytics',
        'Payment receipt generation',
        'Overdue payment alerts',
        'Budget planning tools'
      ]
    },
    {
      id: 'teacher-demo',
      email: 'teacher@demoschool.edu',
      role: 'teacher',
      first_name: 'Michael',
      last_name: 'Davis',
      school_id: 'demo-school-id',
      description: 'Mathematics Teacher',
      features: [
        'Class and section management',
        'Create assessments and quizzes',
        'QR code enrollment system',
        'Grade management',
        'Student progress tracking',
        'Learning module uploads'
      ]
    },
    {
      id: 'parent-demo',
      email: 'parent@demoschool.edu',
      role: 'parent',
      first_name: 'Jennifer',
      last_name: 'Smith',
      school_id: 'demo-school-id',
      description: 'Parent of Alex Johnson',
      features: [
        'View children\'s academic progress',
        'Track fee payments and balances',
        'Receive school announcements',
        'Monitor attendance records',
        'Access grade reports',
        'Communication with teachers'
      ]
    },
    {
      id: 'student-demo',
      email: 'student@demoschool.edu',
      role: 'student',
      first_name: 'Alex',
      last_name: 'Johnson',
      school_id: 'demo-school-id',
      description: 'Grade 10 Student',
      features: [
        'Enroll in subjects via QR codes',
        'Take assessments and quizzes',
        'View grades and progress',
        'Track fee payments',
        'Access learning materials',
        'Read school announcements'
      ]
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'accounting': return <Calculator className="h-8 w-8" />;
      case 'teacher': return <GraduationCap className="h-8 w-8" />;
      case 'parent': return <Users className="h-8 w-8" />;
      case 'student': return <BookOpen className="h-8 w-8" />;
      default: return <Users className="h-8 w-8" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'accounting': return 'red';
      case 'teacher': return 'blue';
      case 'parent': return 'green';
      case 'student': return 'purple';
      default: return 'gray';
    }
  };

  const handleRoleSelect = (user: DemoUser) => {
    onSelectRole(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Play className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Demo Mode</h2>
                <p className="text-gray-600">Choose a role to test the system functionality</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-6 mb-6">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 Test Drive eSkwelAI-LMS</h3>
              <p className="text-gray-700 mb-4">
                Experience the full functionality of our AI-powered Learning Management System 
                from different user perspectives. All features are fully functional with sample data.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">Full Features</div>
                  <div className="text-gray-600">Complete functionality</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">Sample Data</div>
                  <div className="text-gray-600">Realistic test environment</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <CheckCircle className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">No Setup</div>
                  <div className="text-gray-600">Start testing immediately</div>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Role to Test</h3>
            <p className="text-gray-600 mb-6">
              Each role has different features and permissions. Choose one to explore its dashboard and capabilities.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {demoUsers.map((user) => {
                const color = getRoleColor(user.role);
                return (
                  <div
                    key={user.id}
                    className={`border-2 rounded-2xl p-6 transition-all hover:shadow-lg cursor-pointer ${
                      selectedRole === user.role 
                        ? `border-${color}-500 bg-${color}-50` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRole(user.role)}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 capitalize">{user.role}</h4>
                        <p className="text-gray-600 text-sm">{user.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <h5 className="font-medium text-gray-900 text-sm">Key Features:</h5>
                      <div className="grid grid-cols-1 gap-1">
                        {user.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                            <CheckCircle className={`h-3 w-3 text-${color}-500`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {user.features.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{user.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelect(user);
                      }}
                      className={`w-full bg-${color}-600 text-white py-2 px-4 rounded-lg hover:bg-${color}-700 transition-colors font-medium flex items-center justify-center space-x-2`}
                    >
                      <Play className="h-4 w-4" />
                      <span>Test {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Overview */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>What You Can Test</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h5 className="font-medium mb-2">Core Features:</h5>
                <ul className="space-y-1">
                  <li>• Complete dashboard functionality</li>
                  <li>• Data export and reporting</li>
                  <li>• User interface and navigation</li>
                  <li>• Role-specific permissions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Sample Data Includes:</h5>
                <ul className="space-y-1">
                  <li>• Student records and enrollments</li>
                  <li>• Payment history and balances</li>
                  <li>• Assessments and grades</li>
                  <li>• School announcements</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                <strong>Note:</strong> All data shown is sample data for demonstration purposes. 
                Export and print functions are fully functional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRoleSelector;