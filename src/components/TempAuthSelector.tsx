import React, { useState } from 'react';
import { 
  User, 
  Calculator, 
  Users, 
  GraduationCap,
  BookOpen,
  X,
  LogIn
} from 'lucide-react';

interface TempUser {
  id: string;
  email: string;
  role: 'accounting' | 'teacher' | 'parent' | 'student';
  first_name: string;
  last_name: string;
  school_id: string;
}

interface TempAuthSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: TempUser) => void;
}

const TempAuthSelector: React.FC<TempAuthSelectorProps> = ({ isOpen, onClose, onSelectUser }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const testUsers: TempUser[] = [
    {
      id: 'accounting-user',
      email: 'accounting@demoschool.edu',
      role: 'accounting',
      first_name: 'Sarah',
      last_name: 'Johnson',
      school_id: 'demo-school-1'
    },
    {
      id: 'teacher-user',
      email: 'teacher@demoschool.edu',
      role: 'teacher',
      first_name: 'Michael',
      last_name: 'Davis',
      school_id: 'demo-school-1'
    },
    {
      id: 'parent-user',
      email: 'parent@demoschool.edu',
      role: 'parent',
      first_name: 'Jennifer',
      last_name: 'Smith',
      school_id: 'demo-school-1'
    },
    {
      id: 'student-user',
      email: 'student@demoschool.edu',
      role: 'student',
      first_name: 'Alex',
      last_name: 'Johnson',
      school_id: 'demo-school-1'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'accounting': return <Calculator className="h-6 w-6" />;
      case 'teacher': return <GraduationCap className="h-6 w-6" />;
      case 'parent': return <Users className="h-6 w-6" />;
      case 'student': return <BookOpen className="h-6 w-6" />;
      default: return <User className="h-6 w-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'accounting': return 'text-red-600 bg-red-100 border-red-200';
      case 'teacher': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'parent': return 'text-green-600 bg-green-100 border-green-200';
      case 'student': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleUserSelect = (user: TempUser) => {
    onSelectUser(user);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <LogIn className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Demo Login</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Demo Mode:</strong> Select a user role to test the system functionality. 
              No real authentication required - this is for testing purposes only.
            </p>
          </div>

          {/* User Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Role to Test:</h3>
            
            {testUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`w-full p-4 border-2 rounded-xl transition-all hover:shadow-md ${
                  selectedRole === user.role 
                    ? getRoleColor(user.role)
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Features Info */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-900">What you can test:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-red-600" />
                <span><strong>Accounting:</strong> Student enrollment, financial reports, payment tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span><strong>Teacher:</strong> Class management, assessments, QR enrollment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-600" />
                <span><strong>Parent:</strong> Children's balances, payment history, due fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span><strong>Student:</strong> Subject enrollment, assessments, fee tracking</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> All data shown is sample data for demonstration purposes. 
              Export and print functions are fully functional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempAuthSelector;