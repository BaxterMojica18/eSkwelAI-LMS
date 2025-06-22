import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  Settings,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Plus,
  Trash2,
  Crown,
  Star,
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Calculator,
  Camera,
  FileText,
  Bell,
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
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface PaymentInfo {
  plan: 'small' | 'medium' | 'large';
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  amount: number;
  paymentMethod: string;
  cardLast4: string;
  status: 'active' | 'past_due' | 'cancelled';
}

interface SchoolOwnerDashboardProps {
  schoolData: SchoolData;
  onSignOut: () => void;
}

const SchoolOwnerDashboard: React.FC<SchoolOwnerDashboardProps> = ({ schoolData: initialSchoolData, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [schoolData, setSchoolData] = useState<SchoolData>(initialSchoolData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<SchoolData>(initialSchoolData);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    plan: initialSchoolData.plan,
    billingCycle: 'monthly',
    nextBilling: '2025-02-15',
    amount: initialSchoolData.plan === 'small' ? 99 : initialSchoolData.plan === 'medium' ? 199 : 399,
    paymentMethod: 'Credit Card',
    cardLast4: '4242',
    status: 'active'
  });
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    phone: ''
  });

  // Sample teachers data
  useEffect(() => {
    setTeachers([
      {
        id: '1',
        name: 'Michael Davis',
        email: 'michael.davis@school.edu',
        subject: 'Mathematics',
        phone: '+1 (555) 123-4567',
        status: 'active',
        joinDate: '2024-08-15'
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@school.edu',
        subject: 'English Literature',
        phone: '+1 (555) 234-5678',
        status: 'active',
        joinDate: '2024-09-01'
      },
      {
        id: '3',
        name: 'David Chen',
        email: 'david.chen@school.edu',
        subject: 'Science',
        phone: '+1 (555) 345-6789',
        status: 'active',
        joinDate: '2024-07-20'
      }
    ]);
  }, []);

  const handleSaveChanges = () => {
    setSchoolData(editedData);
    setIsEditing(false);
    // Here you would save to your backend
  };

  const handleCancelEdit = () => {
    setEditedData(schoolData);
    setIsEditing(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedData(prev => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.email && newTeacher.subject) {
      const teacher: Teacher = {
        id: Date.now().toString(),
        ...newTeacher,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setTeachers(prev => [...prev, teacher]);
      setNewTeacher({ name: '', email: '', subject: '', phone: '' });
      setShowAddTeacher(false);
    }
  };

  const handleRemoveTeacher = (id: string) => {
    if (confirm('Are you sure you want to remove this teacher?')) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  const toggleTeacherStatus = (id: string) => {
    setTeachers(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
    ));
  };

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'small':
        return { name: 'Small School', price: 99, color: 'blue', icon: Building };
      case 'medium':
        return { name: 'Medium School', price: 199, color: 'green', icon: GraduationCap };
      case 'large':
        return { name: 'Large School', price: 399, color: 'purple', icon: Crown };
      default:
        return { name: 'Small School', price: 99, color: 'blue', icon: Building };
    }
  };

  const planDetails = getPlanDetails(schoolData.plan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {schoolData.logoUrl ? (
                <img
                  src={schoolData.logoUrl}
                  alt="School Logo"
                  className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{schoolData.schoolName}</h1>
                <p className="text-sm text-gray-600">School Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 bg-${planDetails.color}-100 text-${planDetails.color}-800 rounded-full text-sm font-medium`}>
                <planDetails.icon className="h-4 w-4" />
                <span>{planDetails.name}</span>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
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
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'school', label: 'School Info', icon: Building },
              { id: 'teachers', label: 'Teachers', icon: Users },
              { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{schoolData.studentCount || '0'}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${(planDetails.price * 1.2).toFixed(0)}K</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Usage</p>
                    <p className="text-3xl font-bold text-gray-900">94%</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Plus className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-gray-900">Add Teacher</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-gray-900">Manage Classes</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-gray-900">View Reports</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="h-6 w-6 text-orange-600" />
                  <span className="font-medium text-gray-900">Send Announcement</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">New teacher added</p>
                    <p className="text-sm text-gray-600">Sarah Wilson joined as English Literature teacher</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">25 students enrolled</p>
                    <p className="text-sm text-gray-600">New batch of students enrolled for Mathematics class</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Payment received</p>
                    <p className="text-sm text-gray-600">Monthly subscription payment processed successfully</p>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* School Info Tab */}
        {activeTab === 'school' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
                    <p className="text-gray-600">Manage your school's basic information and branding</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Logo Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">School Logo</label>
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        {(isEditing ? editedData.logoUrl : schoolData.logoUrl) ? (
                          <img
                            src={isEditing ? editedData.logoUrl : schoolData.logoUrl}
                            alt="School Logo"
                            className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload-edit"
                          />
                          <label
                            htmlFor="logo-upload-edit"
                            className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Change Logo</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* School Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.schoolName}
                          onChange={(e) => setEditedData(prev => ({ ...prev, schoolName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{schoolData.schoolName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {isEditing ? (
                        <textarea
                          value={editedData.address}
                          onChange={(e) => setEditedData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-900">{schoolData.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedData.phone}
                            onChange={(e) => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{schoolData.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedData.email}
                            onChange={(e) => setEditedData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{schoolData.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editedData.website}
                          onChange={(e) => setEditedData(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{schoolData.website || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Principal Information */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Principal Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Principal Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.principalName}
                          onChange={(e) => setEditedData(prev => ({ ...prev, principalName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{schoolData.principalName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Principal Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedData.principalEmail}
                          onChange={(e) => setEditedData(prev => ({ ...prev, principalEmail: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{schoolData.principalEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Teachers Management</h3>
                    <p className="text-gray-600">Manage your school's teaching staff</p>
                  </div>
                  <button
                    onClick={() => setShowAddTeacher(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Teacher</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">
                                  {teacher.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                              <div className="text-sm text-gray-500">{teacher.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            teacher.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(teacher.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleTeacherStatus(teacher.id)}
                              className={`p-1 rounded ${
                                teacher.status === 'active' 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {teacher.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleRemoveTeacher(teacher.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
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

            {/* Add Teacher Modal */}
            {showAddTeacher && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Add New Teacher</h3>
                      <button
                        onClick={() => setShowAddTeacher(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={newTeacher.name}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter teacher's full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={newTeacher.email}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="teacher@school.edu"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          value={newTeacher.subject}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Mathematics, English, Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={newTeacher.phone}
                          onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => setShowAddTeacher(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTeacher}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Teacher
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                <p className="text-gray-600">Manage your subscription and billing information</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-${planDetails.color}-100 text-${planDetails.color}-600`}>
                      <planDetails.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{planDetails.name}</h4>
                      <p className="text-gray-600">Perfect for your school size</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">${planDetails.price}</div>
                    <div className="text-gray-600">per month</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Next Billing</span>
                    </div>
                    <p className="text-gray-600">{paymentInfo.nextBilling}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Payment Method</span>
                    </div>
                    <p className="text-gray-600">•••• •••• •••• {paymentInfo.cardLast4}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Status</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      paymentInfo.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {paymentInfo.status}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upgrade Plan
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Update Payment Method
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                <p className="text-gray-600">View and download your past invoices</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Jan 15, 2025
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {planDetails.name} - Monthly Subscription
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${planDetails.price}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Dec 15, 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {planDetails.name} - Monthly Subscription
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${planDetails.price}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                <p className="text-gray-600">Manage your account preferences and security</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Notifications */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your school via email</p>
                      </div>
                      <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Get important alerts via text message</p>
                      </div>
                      <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                        <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Security</h4>
                  <div className="space-y-3">
                    <button className="flex items-center space-x-3 text-left w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 text-left w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Data Management */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
                  <div className="space-y-3">
                    <button className="flex items-center space-x-3 text-left w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Export Data</p>
                        <p className="text-sm text-gray-600">Download all your school data</p>
                      </div>
                    </button>
                    <button className="flex items-center space-x-3 text-left w-full p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                      <Trash2 className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-red-500">Permanently delete your school account</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolOwnerDashboard;