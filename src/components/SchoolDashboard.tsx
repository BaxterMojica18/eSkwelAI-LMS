import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  GraduationCap,
  Calculator,
  BookOpen,
  Settings,
  BarChart3,
  Key,
  Copy,
  CheckCircle,
  UserPlus,
  School,
  Mail,
  Phone,
  Globe,
  MapPin,
  Crown,
  Star,
  Zap,
  Shield,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Plus,
  LogOut
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
  schoolCode: string;
}

interface SchoolStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalParents: number;
  activeClasses: number;
  totalPayments: number;
  pendingRegistrations: number;
}

interface SchoolDashboardProps {
  schoolData: SchoolData;
  onSignOut: () => void;
}

const SchoolDashboard: React.FC<SchoolDashboardProps> = ({ schoolData, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCodeCopied, setShowCodeCopied] = useState(false);

  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample school statistics
    const sampleStats: SchoolStats = {
      totalUsers: 847,
      totalTeachers: 45,
      totalStudents: 750,
      totalParents: 52,
      activeClasses: 28,
      totalPayments: 1250000,
      pendingRegistrations: 12
    };

    // Sample users
    const sampleUsers = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@demoschool.edu',
        role: 'teacher',
        status: 'active',
        joined_date: '2024-09-01',
        last_login: '2025-01-20'
      },
      {
        id: '2',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@demoschool.edu',
        role: 'student',
        status: 'active',
        joined_date: '2024-09-15',
        last_login: '2025-01-19'
      },
      {
        id: '3',
        first_name: 'Michael',
        last_name: 'Davis',
        email: 'michael.davis@parent.com',
        role: 'parent',
        status: 'active',
        joined_date: '2024-09-20',
        last_login: '2025-01-18'
      }
    ];

    setStats(sampleStats);
    setUsers(sampleUsers);
    setLoading(false);
  };

  const copySchoolCode = () => {
    navigator.clipboard.writeText(schoolData.schoolCode);
    setShowCodeCopied(true);
    setTimeout(() => setShowCodeCopied(false), 2000);
  };

  const regenerateSchoolCode = () => {
    const prefix = schoolData.schoolName
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCode = `${prefix}${randomNum}`;
    
    // In a real app, this would update the database
    console.log('New school code generated:', newCode);
  };

  const exportUserData = () => {
    const data = users.map(user => ({
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      status: user.status,
      joined_date: user.joined_date,
      last_login: user.last_login
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schoolData.schoolName.replace(/\s+/g, '_')}_users_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'text-blue-600 bg-blue-100';
      case 'student': return 'text-green-600 bg-green-100';
      case 'parent': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanDetails = () => {
    const plans = {
      small: { name: 'Small School', color: 'blue', icon: Building },
      medium: { name: 'Medium School', color: 'green', icon: GraduationCap },
      large: { name: 'Large School', color: 'purple', icon: Crown }
    };
    return plans[schoolData.plan];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading school dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {schoolData.logoUrl ? (
                <img
                  src={schoolData.logoUrl}
                  alt="School Logo"
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{schoolData.schoolName}</h1>
                <p className="text-sm text-gray-600">School Administration Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => generateSampleData()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'registration', label: 'Registration', icon: UserPlus },
              { id: 'settings', label: 'School Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* School Info Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {schoolData.logoUrl ? (
                    <img
                      src={schoolData.logoUrl}
                      alt="School Logo"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-xl bg-white/20 flex items-center justify-center">
                      <Building className="h-10 w-10" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{schoolData.schoolName}</h2>
                    <p className="text-blue-100 mb-1">{schoolData.address}</p>
                    <div className="flex items-center space-x-4 text-sm text-blue-100">
                      <span>{schoolData.email}</span>
                      <span>•</span>
                      <span>{schoolData.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-2`}>
                    {React.createElement(getPlanDetails().icon, { className: 'h-4 w-4' })}
                    <span>{getPlanDetails().name}</span>
                  </div>
                  <div className="text-blue-100 text-sm">Principal: {schoolData.principalName}</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
                  </div>
                  <GraduationCap className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Classes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeClasses}</p>
                  </div>
                  <School className="h-12 w-12 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Invite New Users</div>
                      <div className="text-sm text-gray-600">Send registration invitations</div>
                    </div>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Download className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Export Reports</div>
                      <div className="text-sm text-gray-600">Download user and activity reports</div>
                    </div>
                  </button>
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <Settings className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">School Settings</div>
                      <div className="text-sm text-gray-600">Configure school preferences</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New teacher registered</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">5 students enrolled</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Parent account linked</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={exportUserData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Export Users</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.first_name[0]}{user.last_name[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.joined_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.last_login).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Registration Tab */}
        {activeTab === 'registration' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">School Registration Management</h2>
              <p className="text-gray-600">Manage your school's registration code and user invitations</p>
            </div>

            {/* School Code Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <Key className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">School Registration Code</h3>
                <p className="text-gray-600">Share this code with teachers, students, and parents to join your school</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 border-2 border-dashed border-blue-300 mb-4">
                      <div className="text-3xl font-bold text-blue-600 tracking-wider font-mono">
                        {schoolData.schoolCode}
                      </div>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={copySchoolCode}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{showCodeCopied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                      <button
                        onClick={regenerateSchoolCode}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Key className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-yellow-900 mb-2">How to use this code:</h5>
                      <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• Share this code with new users</li>
                        <li>• They enter it during registration</li>
                        <li>• Automatically links them to your school</li>
                        <li>• Regenerate if compromised</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Instructions */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">For Teachers</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Teachers can register and immediately start creating classes and managing students.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                    Registration Code: <span className="font-mono font-bold">{schoolData.schoolCode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">For Students</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Students can register and join classes using QR codes provided by teachers.
                  </p>
                  <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800">
                    Registration Code: <span className="font-mono font-bold">{schoolData.schoolCode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">For Parents</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Parents can register and link their accounts to their children's accounts.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-800">
                    Registration Code: <span className="font-mono font-bold">{schoolData.schoolCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Registrations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Registrations</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                    {stats?.pendingRegistrations || 0} pending
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Pending Registrations</h4>
                  <p className="text-gray-600">All registration requests have been processed.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">School Settings</h2>
              <p className="text-gray-600">Manage your school's information and preferences</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* School Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input
                      type="text"
                      value={schoolData.schoolName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={schoolData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={schoolData.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={schoolData.address}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Principal Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Principal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                    <input
                      type="text"
                      value={schoolData.principalName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Principal Email</label>
                    <input
                      type="email"
                      value={schoolData.principalEmail}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  {schoolData.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={schoolData.website}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Plan Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {React.createElement(getPlanDetails().icon, { 
                    className: `h-12 w-12 text-${getPlanDetails().color}-600` 
                  })}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{getPlanDetails().name}</h4>
                    <p className="text-gray-600">Active subscription</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolDashboard;