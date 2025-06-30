import React, { useState } from 'react';
import {
  Building,
  Users,
  Calculator,
  GraduationCap,
  BookOpen,
  X,
  LogIn,
  Eye,
  Star,
  CheckCircle,
  ArrowRight,
  Crown,
  Zap,
  Shield,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface SchoolData {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  principalEmail: string;
  logoUrl: string;
  plan: 'small' | 'medium' | 'large';
  studentCount: string;
  teacherCount: string;
}

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

interface SchoolDemoAccessProps {
  isOpen: boolean;
  onClose: () => void;
  schoolData: SchoolData;
  onSelectUser: (user: DemoUser) => void;
}

const SchoolDemoAccess: React.FC<SchoolDemoAccessProps> = ({ 
  isOpen, 
  onClose, 
  schoolData, 
  onSelectUser 
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const demoUsers: DemoUser[] = [
    {
      id: 'accounting-demo',
      email: `accounting@${schoolData.schoolName.toLowerCase().replace(/\s+/g, '')}.edu`,
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
      email: `teacher@${schoolData.schoolName.toLowerCase().replace(/\s+/g, '')}.edu`,
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
      email: `parent@${schoolData.schoolName.toLowerCase().replace(/\s+/g, '')}.edu`,
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
      email: `student@${schoolData.schoolName.toLowerCase().replace(/\s+/g, '')}.edu`,
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

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'small': return <Building className="h-5 w-5" />;
      case 'medium': return <GraduationCap className="h-5 w-5" />;
      case 'large': return <Crown className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'small': return 'blue';
      case 'medium': return 'green';
      case 'large': return 'purple';
      default: return 'blue';
    }
  };

  const handleUserSelect = (user: DemoUser) => {
    onSelectUser(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {schoolData.logoUrl ? (
                <img
                  src={schoolData.logoUrl}
                  alt="School Logo"
                  className="h-16 w-16 rounded-lg object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{schoolData.schoolName}</h2>
                <p className="text-gray-600">Welcome to your eSkwelAI-LMS Demo</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 bg-${getPlanColor(schoolData.plan)}-100 text-${getPlanColor(schoolData.plan)}-800 rounded-full text-xs font-medium`}>
                    {getPlanIcon(schoolData.plan)}
                    <span className="capitalize">{schoolData.plan} Plan</span>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>30-Day Trial Active</span>
                  </div>
                </div>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Registration Successful!</h3>
              <p className="text-gray-700 mb-4">
                Your school has been registered successfully. Explore the full functionality of eSkwelAI-LMS 
                with these demo accounts representing different user roles in your school.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">Secure & Private</div>
                  <div className="text-gray-600">Your data is protected</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <Zap className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">Instant Access</div>
                  <div className="text-gray-600">Start using immediately</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <Phone className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <div className="font-medium text-gray-900">24/7 Support</div>
                  <div className="text-gray-600">We're here to help</div>
                </div>
              </div>
            </div>
          </div>

          {/* School Information Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Your School Information</span>
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{schoolData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{schoolData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Principal:</span>
                <span className="font-medium">{schoolData.principalName}</span>
              </div>
              {schoolData.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium">{schoolData.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Test Drive Your School Management System</h3>
            <p className="text-gray-600 mb-6">
              Click on any role below to experience the full functionality of eSkwelAI-LMS from different perspectives.
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
                        handleUserSelect(user);
                      }}
                      className={`w-full bg-${color}-600 text-white py-2 px-4 rounded-lg hover:bg-${color}-700 transition-colors font-medium flex items-center justify-center space-x-2`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login as {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
              <ArrowRight className="h-5 w-5" />
              <span>What's Next?</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h5 className="font-medium mb-2">During Your Trial:</h5>
                <ul className="space-y-1">
                  <li>• Test all features with sample data</li>
                  <li>• Import your existing student records</li>
                  <li>• Set up your school's grade levels and sections</li>
                  <li>• Train your staff on the system</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">We'll Help You:</h5>
                <ul className="space-y-1">
                  <li>• Schedule a personalized onboarding session</li>
                  <li>• Migrate your data from existing systems</li>
                  <li>• Customize the system for your needs</li>
                  <li>• Provide training for your team</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-blue-700 text-sm">
                <strong>Need help?</strong> Contact our support team at{' '}
                <a href="mailto:support@eskwelai-lms.com" className="underline">support@eskwelai-lms.com</a>{' '}
                or call <a href="tel:+15551234567" className="underline">+1 (555) 123-4567</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDemoAccess;