import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  GraduationCap,
  Calculator,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Mail,
  Phone,
  Globe,
  MapPin,
  Crown,
  CreditCard,
  FileText,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Save,
  X,
  Key,
  Shield,
  Smartphone,
  BookOpen,
  Target,
  Award,
  PieChart,
  Activity,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  Zap,
  UserPlus,
  School,
  Layers,
  Grid,
  List,
  MoreVertical
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
  classes: number;
  students: number;
}

interface SchoolLevel {
  id: string;
  name: string;
  description: string;
  sections: Section[];
  studentCount: number;
  teacherCount: number;
}

interface Section {
  id: string;
  name: string;
  capacity: number;
  enrolled: number;
  teacher: string;
  subject: string;
  schedule: string;
  room: string;
}

interface ReportData {
  enrollment: {
    total: number;
    byLevel: { level: string; count: number; percentage: number }[];
    trend: { month: string; count: number }[];
  };
  financial: {
    totalRevenue: number;
    pendingPayments: number;
    collectionRate: number;
    monthlyTrend: { month: string; revenue: number; expenses: number }[];
  };
  academic: {
    averageGrade: number;
    passRate: number;
    assessmentCount: number;
    topPerformers: { name: string; grade: number; level: string }[];
  };
  teachers: {
    totalTeachers: number;
    activeTeachers: number;
    averageClassSize: number;
    performance: { name: string; rating: number; classes: number }[];
  };
}

interface SchoolOwnerDashboardProps {
  schoolData: SchoolData;
  onSignOut: () => void;
}

const SchoolOwnerDashboard: React.FC<SchoolOwnerDashboardProps> = ({ schoolData, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showManageClassesModal, setShowManageClassesModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);

  // State for school info editing
  const [editingSchoolInfo, setEditingSchoolInfo] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState(schoolData);

  // State for teachers
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      subject: 'Mathematics',
      phone: '+1 (555) 123-4567',
      status: 'active',
      joinDate: '2023-08-15',
      classes: 4,
      students: 120
    },
    {
      id: '2',
      name: 'Prof. Michael Davis',
      email: 'michael.davis@school.edu',
      subject: 'Science',
      phone: '+1 (555) 234-5678',
      status: 'active',
      joinDate: '2023-09-01',
      classes: 3,
      students: 90
    },
    {
      id: '3',
      name: 'Ms. Emily Wilson',
      email: 'emily.wilson@school.edu',
      subject: 'English',
      phone: '+1 (555) 345-6789',
      status: 'inactive',
      joinDate: '2023-07-20',
      classes: 2,
      students: 60
    }
  ]);

  // State for school levels and classes
  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>([
    {
      id: '1',
      name: 'Elementary',
      description: 'Grades 1-6',
      studentCount: 300,
      teacherCount: 15,
      sections: [
        {
          id: '1',
          name: 'Grade 1-A',
          capacity: 30,
          enrolled: 28,
          teacher: 'Ms. Johnson',
          subject: 'General Education',
          schedule: 'Mon-Fri 8:00-12:00',
          room: 'Room 101'
        },
        {
          id: '2',
          name: 'Grade 2-A',
          capacity: 30,
          enrolled: 25,
          teacher: 'Mr. Davis',
          subject: 'General Education',
          schedule: 'Mon-Fri 8:00-12:00',
          room: 'Room 102'
        },
        {
          id: '3',
          name: 'Grade 3-A',
          capacity: 30,
          enrolled: 30,
          teacher: 'Ms. Wilson',
          subject: 'General Education',
          schedule: 'Mon-Fri 8:00-12:00',
          room: 'Room 103'
        }
      ]
    },
    {
      id: '2',
      name: 'Middle School',
      description: 'Grades 7-9',
      studentCount: 250,
      teacherCount: 12,
      sections: [
        {
          id: '4',
          name: 'Grade 7-A',
          capacity: 35,
          enrolled: 32,
          teacher: 'Dr. Brown',
          subject: 'Mathematics',
          schedule: 'Mon-Fri 1:00-5:00',
          room: 'Room 201'
        },
        {
          id: '5',
          name: 'Grade 8-A',
          capacity: 35,
          enrolled: 28,
          teacher: 'Prof. Garcia',
          subject: 'Science',
          schedule: 'Mon-Fri 1:00-5:00',
          room: 'Room 202'
        }
      ]
    },
    {
      id: '3',
      name: 'High School',
      description: 'Grades 10-12',
      studentCount: 200,
      teacherCount: 18,
      sections: [
        {
          id: '6',
          name: 'Grade 10-A',
          capacity: 40,
          enrolled: 35,
          teacher: 'Dr. Martinez',
          subject: 'Advanced Mathematics',
          schedule: 'Mon-Fri 7:00-3:00',
          room: 'Room 301'
        },
        {
          id: '7',
          name: 'Grade 11-A',
          capacity: 40,
          enrolled: 38,
          teacher: 'Ms. Thompson',
          subject: 'Physics',
          schedule: 'Mon-Fri 7:00-3:00',
          room: 'Room 302'
        }
      ]
    }
  ]);

  // State for reports
  const [reportData, setReportData] = useState<ReportData>({
    enrollment: {
      total: 750,
      byLevel: [
        { level: 'Elementary', count: 300, percentage: 40 },
        { level: 'Middle School', count: 250, percentage: 33.3 },
        { level: 'High School', count: 200, percentage: 26.7 }
      ],
      trend: [
        { month: 'Jan', count: 720 },
        { month: 'Feb', count: 735 },
        { month: 'Mar', count: 750 },
        { month: 'Apr', count: 745 },
        { month: 'May', count: 750 }
      ]
    },
    financial: {
      totalRevenue: 450000,
      pendingPayments: 25000,
      collectionRate: 94.7,
      monthlyTrend: [
        { month: 'Jan', revenue: 85000, expenses: 65000 },
        { month: 'Feb', revenue: 90000, expenses: 68000 },
        { month: 'Mar', revenue: 95000, expenses: 70000 },
        { month: 'Apr', revenue: 88000, expenses: 67000 },
        { month: 'May', revenue: 92000, expenses: 69000 }
      ]
    },
    academic: {
      averageGrade: 87.5,
      passRate: 96.2,
      assessmentCount: 145,
      topPerformers: [
        { name: 'Alice Johnson', grade: 98.5, level: 'Grade 11' },
        { name: 'Bob Smith', grade: 97.2, level: 'Grade 10' },
        { name: 'Carol Davis', grade: 96.8, level: 'Grade 12' }
      ]
    },
    teachers: {
      totalTeachers: 45,
      activeTeachers: 42,
      averageClassSize: 28.5,
      performance: [
        { name: 'Dr. Sarah Johnson', rating: 4.9, classes: 4 },
        { name: 'Prof. Michael Davis', rating: 4.8, classes: 3 },
        { name: 'Ms. Emily Wilson', rating: 4.7, classes: 2 }
      ]
    }
  });

  // Form states
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    targetAudience: [] as string[],
    priority: 'normal' as 'low' | 'normal' | 'high'
  });

  const [newSection, setNewSection] = useState({
    levelId: '',
    name: '',
    capacity: '',
    teacher: '',
    subject: '',
    schedule: '',
    room: ''
  });

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [reportFilter, setReportFilter] = useState('all');
  const [reportDateRange, setReportDateRange] = useState('month');

  // Billing state
  const [paymentInfo, setPaymentInfo] = useState({
    plan: schoolData.plan,
    nextBilling: '2024-02-15',
    amount: schoolData.plan === 'small' ? 99 : schoolData.plan === 'medium' ? 199 : 399,
    cardLast4: '4242',
    status: 'active' as 'active' | 'past_due' | 'cancelled'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false
  });

  // Quick action handlers
  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const teacher: Teacher = {
      id: Date.now().toString(),
      name: newTeacher.name,
      email: newTeacher.email,
      subject: newTeacher.subject,
      phone: newTeacher.phone,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      classes: 0,
      students: 0
    };

    setTeachers(prev => [...prev, teacher]);
    setNewTeacher({ name: '', email: '', subject: '', phone: '' });
    setShowAddTeacherModal(false);
    setLoading(false);
    alert('Teacher added successfully!');
  };

  const handleAddSection = async () => {
    if (!newSection.levelId || !newSection.name || !newSection.capacity) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const section: Section = {
      id: Date.now().toString(),
      name: newSection.name,
      capacity: parseInt(newSection.capacity),
      enrolled: 0,
      teacher: newSection.teacher,
      subject: newSection.subject,
      schedule: newSection.schedule,
      room: newSection.room
    };

    setSchoolLevels(prev => prev.map(level => 
      level.id === newSection.levelId 
        ? { ...level, sections: [...level.sections, section] }
        : level
    ));

    setNewSection({
      levelId: '',
      name: '',
      capacity: '',
      teacher: '',
      subject: '',
      schedule: '',
      room: ''
    });
    setLoading(false);
    alert('Section added successfully!');
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.title || !announcement.content) {
      alert('Please fill in title and content');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate sending announcement
    setAnnouncement({
      title: '',
      content: '',
      targetAudience: [],
      priority: 'normal'
    });
    setShowAnnouncementModal(false);
    setLoading(false);
    alert('Announcement sent successfully!');
  };

  // Settings handlers
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePasswordModal(false);
    setLoading(false);
    alert('Password changed successfully!');
  };

  const handleExportData = async () => {
    setLoading(true);
    
    // Simulate data preparation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exportData = {
      school: schoolInfo,
      teachers: teachers,
      schoolLevels: schoolLevels,
      reportData: reportData,
      exportDate: new Date().toISOString(),
      totalRecords: teachers.length + schoolLevels.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schoolInfo.schoolName.replace(/\s+/g, '_')}_data_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setLoading(false);
    alert('Data exported successfully!');
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') {
      alert('Account deletion cancelled');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowDeleteAccountModal(false);
    setLoading(false);
    alert('Account deletion initiated. You will receive a confirmation email.');
  };

  // Billing handlers
  const handleUpgradePlan = async (newPlan: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const planPrices = { small: 99, medium: 199, large: 399 };
    setPaymentInfo(prev => ({
      ...prev,
      plan: newPlan as any,
      amount: planPrices[newPlan as keyof typeof planPrices]
    }));

    setShowUpgradePlanModal(false);
    setLoading(false);
    alert(`Plan upgraded to ${newPlan} successfully!`);
  };

  const handleUpdatePayment = async () => {
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
      alert('Please fill in all payment details');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPaymentInfo(prev => ({ 
      ...prev, 
      cardLast4: paymentForm.cardNumber.slice(-4) 
    }));
    setPaymentForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
    setShowUpdatePaymentModal(false);
    setLoading(false);
    alert('Payment method updated successfully!');
  };

  const handleDownloadInvoice = async (date: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock invoice data
    const invoiceData = `
INVOICE - ${schoolInfo.schoolName}
Date: ${date}
Plan: ${paymentInfo.plan.charAt(0).toUpperCase() + paymentInfo.plan.slice(1)}
Amount: $${paymentInfo.amount}
Status: Paid
    `;

    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLoading(false);
  };

  const toggleTeacherStatus = (teacherId: string) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: teacher.status === 'active' ? 'inactive' : 'active' }
        : teacher
    ));
  };

  const removeTeacher = (teacherId: string) => {
    if (confirm('Are you sure you want to remove this teacher?')) {
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
    }
  };

  const handleSaveSchoolInfo = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEditingSchoolInfo(false);
    setLoading(false);
    alert('School information updated successfully!');
  };

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
                  className="h-10 w-10 rounded-lg object-cover"
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
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <button
                onClick={onSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
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
              { id: 'school-info', label: 'School Info', icon: Building },
              { id: 'teachers', label: 'Teachers', icon: Users },
              { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
              { id: 'settings', label: 'Settings', icon: Settings }
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{reportData.enrollment.total}</p>
                    <p className="text-sm text-green-600">+5% from last month</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                    <p className="text-3xl font-bold text-gray-900">{reportData.teachers.activeTeachers}</p>
                    <p className="text-sm text-blue-600">{reportData.teachers.totalTeachers} total</p>
                  </div>
                  <GraduationCap className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${(reportData.financial.totalRevenue / 5).toLocaleString()}</p>
                    <p className="text-sm text-green-600">+8% from last month</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                    <p className="text-3xl font-bold text-gray-900">{reportData.academic.averageGrade}%</p>
                    <p className="text-sm text-green-600">{reportData.academic.passRate}% pass rate</p>
                  </div>
                  <Award className="h-12 w-12 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowAddTeacherModal(true)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <UserPlus className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Add Teacher</div>
                    <div className="text-sm text-gray-600">Register new faculty</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowManageClassesModal(true)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <School className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Manage Classes</div>
                    <div className="text-sm text-gray-600">Organize sections & levels</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowReportsModal(true)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">View Reports</div>
                    <div className="text-sm text-gray-600">Analytics & insights</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Bell className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-900">Send Announcement</div>
                    <div className="text-sm text-gray-600">Notify school community</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New teacher registered</p>
                    <p className="text-xs text-gray-600">Dr. Sarah Johnson joined Mathematics department</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payment received</p>
                    <p className="text-xs text-gray-600">$2,500 tuition payment from Grade 10-A</p>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New assessment created</p>
                    <p className="text-xs text-gray-600">Mathematics Quiz for Grade 8 students</p>
                  </div>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* School Info Tab */}
        {activeTab === 'school-info' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
                  <button
                    onClick={() => editingSchoolInfo ? handleSaveSchoolInfo() : setEditingSchoolInfo(true)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingSchoolInfo ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                    <span>{editingSchoolInfo ? 'Save Changes' : 'Edit Info'}</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                    <input
                      type="text"
                      value={schoolInfo.schoolName}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, schoolName: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={schoolInfo.email}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={schoolInfo.phone}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={schoolInfo.website}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={schoolInfo.address}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Principal Name</label>
                    <input
                      type="text"
                      value={schoolInfo.principalName}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, principalName: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Principal Email</label>
                    <input
                      type="email"
                      value={schoolInfo.principalEmail}
                      onChange={(e) => setSchoolInfo(prev => ({ ...prev, principalEmail: e.target.value }))}
                      disabled={!editingSchoolInfo}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
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
                  <h3 className="text-lg font-semibold text-gray-900">Teachers ({teachers.length})</h3>
                  <button
                    onClick={() => setShowAddTeacherModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.classes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.students}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {teacher.status}
                          </span>
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
                              {teacher.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => removeTeacher(teacher.id)}
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
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Crown className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{paymentInfo.plan} Plan</h4>
                    <p className="text-sm text-gray-600">Next billing: {paymentInfo.nextBilling}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${paymentInfo.amount}/month</div>
                  <button
                    onClick={() => setShowUpgradePlanModal(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                <button
                  onClick={() => setShowUpdatePaymentModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Update
                </button>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <CreditCard className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• {paymentInfo.cardLast4}</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
              <div className="space-y-3">
                {['2024-01-15', '2023-12-15', '2023-11-15'].map((date) => (
                  <div key={date} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">${paymentInfo.amount}.00</p>
                      <p className="text-sm text-gray-600">{date}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadInvoice(date)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <Key className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Change Password</div>
                    <div className="text-sm text-gray-600">Update your account password</div>
                  </div>
                </button>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via email</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via text message</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  disabled={loading}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">Export Data</div>
                    <div className="text-sm text-gray-600">Download all your school data</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowDeleteAccountModal(true)}
                  className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-3"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">Delete Account</div>
                    <div className="text-sm text-red-600">Permanently delete your school account</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Teacher</h3>
                <button
                  onClick={() => setShowAddTeacherModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jane.smith@school.edu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                  </select>
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
                  onClick={() => setShowAddTeacherModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeacher}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Teacher</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Classes Modal */}
      {showManageClassesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Manage Classes & Sections</h3>
                <button
                  onClick={() => setShowManageClassesModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Class Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Layers className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">School Levels</p>
                      <p className="text-2xl font-bold text-blue-900">{schoolLevels.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Grid className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Total Sections</p>
                      <p className="text-2xl font-bold text-green-900">
                        {schoolLevels.reduce((acc, level) => acc + level.sections.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Total Students</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {schoolLevels.reduce((acc, level) => acc + level.studentCount, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Total Teachers</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {schoolLevels.reduce((acc, level) => acc + level.teacherCount, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New Section Form */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <select
                    value={newSection.levelId}
                    onChange={(e) => setNewSection(prev => ({ ...prev, levelId: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Level</option>
                    {schoolLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Section Name"
                    value={newSection.name}
                    onChange={(e) => setNewSection(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={newSection.capacity}
                    onChange={(e) => setNewSection(prev => ({ ...prev, capacity: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddSection}
                    disabled={loading || !newSection.levelId || !newSection.name || !newSection.capacity}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add Section</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* School Levels and Sections */}
              <div className="space-y-6">
                {schoolLevels.map((level) => (
                  <div key={level.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div 
                      className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {selectedLevel === level.id ? (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                          )}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{level.name}</h4>
                            <p className="text-sm text-gray-600">{level.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{level.sections.length}</div>
                            <div>Sections</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{level.studentCount}</div>
                            <div>Students</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{level.teacherCount}</div>
                            <div>Teachers</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedLevel === level.id && (
                      <div className="p-4 bg-white">
                        <div className="grid gap-4">
                          {level.sections.map((section) => (
                            <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <h5 className="font-semibold text-gray-900">{section.name}</h5>
                                    <p className="text-sm text-gray-600">{section.subject}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Teacher</p>
                                    <p className="font-medium text-gray-900">{section.teacher}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Enrollment</p>
                                    <p className="font-medium text-gray-900">
                                      {section.enrolled}/{section.capacity}
                                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                        section.enrolled >= section.capacity 
                                          ? 'bg-red-100 text-red-800' 
                                          : section.enrolled >= section.capacity * 0.8
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {Math.round((section.enrolled / section.capacity) * 100)}%
                                      </span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Schedule</p>
                                    <p className="font-medium text-gray-900">{section.schedule}</p>
                                    <p className="text-sm text-gray-600">{section.room}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">School Analytics & Reports</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={reportDateRange}
                    onChange={(e) => setReportDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <button
                    onClick={() => setShowReportsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Report Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Enrollment</p>
                      <p className="text-3xl font-bold">{reportData.enrollment.total}</p>
                      <p className="text-blue-100 text-sm">+5.2% from last month</p>
                    </div>
                    <Users className="h-12 w-12 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Monthly Revenue</p>
                      <p className="text-3xl font-bold">${(reportData.financial.totalRevenue / 5).toLocaleString()}</p>
                      <p className="text-green-100 text-sm">{reportData.financial.collectionRate}% collection rate</p>
                    </div>
                    <DollarSign className="h-12 w-12 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Average Grade</p>
                      <p className="text-3xl font-bold">{reportData.academic.averageGrade}%</p>
                      <p className="text-purple-100 text-sm">{reportData.academic.passRate}% pass rate</p>
                    </div>
                    <Award className="h-12 w-12 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Active Teachers</p>
                      <p className="text-3xl font-bold">{reportData.teachers.activeTeachers}</p>
                      <p className="text-orange-100 text-sm">Avg {reportData.teachers.averageClassSize} students/class</p>
                    </div>
                    <GraduationCap className="h-12 w-12 text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Detailed Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrollment Report */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Enrollment by Level</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {reportData.enrollment.byLevel.map((level, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">{level.level}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{level.count}</div>
                          <div className="text-sm text-gray-600">{level.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Report */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Financial Overview</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800 font-medium">Total Revenue</span>
                      <span className="text-green-900 font-bold">${reportData.financial.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-800 font-medium">Pending Payments</span>
                      <span className="text-yellow-900 font-bold">${reportData.financial.pendingPayments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800 font-medium">Collection Rate</span>
                      <span className="text-blue-900 font-bold">{reportData.financial.collectionRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Academic Performance */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Academic Performance</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-900">{reportData.academic.averageGrade}%</div>
                        <div className="text-sm text-purple-600">Average Grade</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-900">{reportData.academic.passRate}%</div>
                        <div className="text-sm text-green-600">Pass Rate</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Top Performers</h5>
                      <div className="space-y-2">
                        {reportData.academic.topPerformers.map((student, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600">{student.level}</div>
                            </div>
                            <div className="text-lg font-bold text-green-600">{student.grade}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Performance */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Teacher Performance</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{reportData.teachers.activeTeachers}</div>
                        <div className="text-sm text-blue-600">Active Teachers</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-900">{reportData.teachers.averageClassSize}</div>
                        <div className="text-sm text-orange-600">Avg Class Size</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Top Rated Teachers</h5>
                      <div className="space-y-2">
                        {reportData.teachers.performance.map((teacher, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-gray-900">{teacher.name}</div>
                              <div className="text-sm text-gray-600">{teacher.classes} classes</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-bold text-gray-900">{teacher.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export All Reports */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Export Complete Report</h4>
                    <p className="text-sm text-gray-600">Download comprehensive analytics report with all data</p>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Download Full Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Send Announcement</h3>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={announcement.content}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your announcement here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Students', 'Teachers', 'Parents', 'Staff'].map((audience) => (
                      <label key={audience} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={announcement.targetAudience.includes(audience)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAnnouncement(prev => ({
                                ...prev,
                                targetAudience: [...prev.targetAudience, audience]
                              }));
                            } else {
                              setAnnouncement(prev => ({
                                ...prev,
                                targetAudience: prev.targetAudience.filter(a => a !== audience)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{audience}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={announcement.priority}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" />
                      <span>Send Announcement</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-red-900">Delete Account</h3>
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">Warning: This action cannot be undone</span>
                  </div>
                  <p className="text-red-700 text-sm mt-2">
                    Deleting your account will permanently remove all school data, including student records, 
                    teacher information, and financial data.
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  If you're sure you want to delete your account, we'll send you a confirmation email 
                  with final steps to complete the deletion process.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradePlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h3>
                <button
                  onClick={() => setShowUpgradePlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { id: 'small', name: 'Small', price: 99, features: ['500 Students', '50 Teachers', 'Basic Support'] },
                  { id: 'medium', name: 'Medium', price: 199, features: ['1,000 Students', '100 Teachers', 'Priority Support'], popular: true },
                  { id: 'large', name: 'Large', price: 399, features: ['5,000+ Students', '500+ Teachers', '24/7 Support'] }
                ].map((plan) => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-xl p-6 ${
                      plan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    } ${paymentInfo.plan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="text-center mb-4">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                      <div className="text-3xl font-bold text-gray-900 mt-2">${plan.price}/month</div>
                    </div>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleUpgradePlan(plan.id)}
                      disabled={loading || paymentInfo.plan === plan.id}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        paymentInfo.plan === plan.id
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {paymentInfo.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Modal */}
      {showUpdatePaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Update Payment Method</h3>
                <button
                  onClick={() => setShowUpdatePaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentForm.expiryDate}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={paymentForm.cardholderName}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdatePaymentModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePayment}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Payment</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolOwnerDashboard;