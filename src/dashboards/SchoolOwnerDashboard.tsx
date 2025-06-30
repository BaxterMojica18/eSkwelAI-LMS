import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  GraduationCap,
  DollarSign,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Target,
  Activity,
  CreditCard,
  FileText,
  Printer,
  RefreshCw,
  LogOut,
  Save,
  X,
  Camera,
  Palette,
  Type,
  Image as ImageIcon,
  School,
  Star,
  UserPlus,
  UserCheck,
  UserX,
  Send,
  MessageSquare,
  Bell,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  QrCode,
  Scan
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

interface SchoolOwnerDashboardProps {
  schoolData: SchoolData;
  onSignOut: () => void;
}

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  grade_level: string;
  section: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  gpa: number;
  attendance_rate: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  date_of_birth: string;
  emergency_contact: string;
  medical_notes: string;
  fees_balance: number;
  last_payment: string;
}

interface Teacher {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  subjects: string[];
  qualifications: string[];
  experience_years: number;
  performance_rating: number;
  classes_assigned: number;
  students_count: number;
  address: string;
  emergency_contact: string;
  contract_type: 'full_time' | 'part_time' | 'contract';
}

interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  reference_number: string;
  payment_method: string;
  notes: string;
  created_by: string;
}

const SchoolOwnerDashboard: React.FC<SchoolOwnerDashboardProps> = ({ schoolData, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('6months');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'student' | 'teacher' | 'finance' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Theme customization state
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#8B5CF6',
    textColor: '#1F2937',
    schoolName: schoolData.schoolName,
    logoUrl: schoolData.logoUrl
  });

  // Sample data
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'stu-001',
      student_id: 'STU2025001',
      first_name: 'Emma',
      last_name: 'Johnson',
      email: 'emma.johnson@demoschool.edu',
      phone: '+1 (555) 123-4567',
      grade_level: 'Grade 10',
      section: 'A',
      enrollment_date: '2024-09-01',
      status: 'active',
      gpa: 3.85,
      attendance_rate: 96.5,
      parent_name: 'Michael Johnson',
      parent_email: 'michael.johnson@email.com',
      parent_phone: '+1 (555) 123-4568',
      address: '123 Oak Street, Springfield, IL 62701',
      date_of_birth: '2008-03-15',
      emergency_contact: 'Sarah Johnson - +1 (555) 123-4569',
      medical_notes: 'No known allergies',
      fees_balance: 250.00,
      last_payment: '2025-01-15'
    },
    {
      id: 'stu-002',
      student_id: 'STU2025002',
      first_name: 'James',
      last_name: 'Wilson',
      email: 'james.wilson@demoschool.edu',
      phone: '+1 (555) 234-5678',
      grade_level: 'Grade 11',
      section: 'B',
      enrollment_date: '2023-09-01',
      status: 'active',
      gpa: 3.92,
      attendance_rate: 98.2,
      parent_name: 'Lisa Wilson',
      parent_email: 'lisa.wilson@email.com',
      parent_phone: '+1 (555) 234-5679',
      address: '456 Pine Avenue, Springfield, IL 62702',
      date_of_birth: '2007-07-22',
      emergency_contact: 'Robert Wilson - +1 (555) 234-5680',
      medical_notes: 'Asthma - carries inhaler',
      fees_balance: 0.00,
      last_payment: '2025-01-10'
    },
    {
      id: 'stu-003',
      student_id: 'STU2025003',
      first_name: 'Sophia',
      last_name: 'Davis',
      email: 'sophia.davis@demoschool.edu',
      phone: '+1 (555) 345-6789',
      grade_level: 'Grade 9',
      section: 'A',
      enrollment_date: '2024-09-01',
      status: 'active',
      gpa: 3.67,
      attendance_rate: 94.8,
      parent_name: 'Jennifer Davis',
      parent_email: 'jennifer.davis@email.com',
      parent_phone: '+1 (555) 345-6790',
      address: '789 Maple Drive, Springfield, IL 62703',
      date_of_birth: '2009-11-08',
      emergency_contact: 'David Davis - +1 (555) 345-6791',
      medical_notes: 'Lactose intolerant',
      fees_balance: 500.00,
      last_payment: '2024-12-20'
    }
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 'tea-001',
      employee_id: 'EMP2024001',
      first_name: 'Dr. Sarah',
      last_name: 'Mitchell',
      email: 'sarah.mitchell@demoschool.edu',
      phone: '+1 (555) 111-2222',
      department: 'Mathematics',
      position: 'Department Head',
      hire_date: '2020-08-15',
      status: 'active',
      salary: 75000,
      subjects: ['Algebra II', 'Calculus', 'Statistics'],
      qualifications: ['Ph.D. Mathematics', 'M.Ed. Curriculum'],
      experience_years: 12,
      performance_rating: 4.8,
      classes_assigned: 5,
      students_count: 125,
      address: '321 University Ave, Springfield, IL 62704',
      emergency_contact: 'John Mitchell - +1 (555) 111-2223',
      contract_type: 'full_time'
    },
    {
      id: 'tea-002',
      employee_id: 'EMP2024002',
      first_name: 'Michael',
      last_name: 'Rodriguez',
      email: 'michael.rodriguez@demoschool.edu',
      phone: '+1 (555) 222-3333',
      department: 'Science',
      position: 'Senior Teacher',
      hire_date: '2019-01-10',
      status: 'active',
      salary: 68000,
      subjects: ['Biology', 'Chemistry', 'Environmental Science'],
      qualifications: ['M.S. Biology', 'B.Ed. Science Education'],
      experience_years: 8,
      performance_rating: 4.6,
      classes_assigned: 4,
      students_count: 98,
      address: '654 Science Blvd, Springfield, IL 62705',
      emergency_contact: 'Maria Rodriguez - +1 (555) 222-3334',
      contract_type: 'full_time'
    },
    {
      id: 'tea-003',
      employee_id: 'EMP2024003',
      first_name: 'Emily',
      last_name: 'Chen',
      email: 'emily.chen@demoschool.edu',
      phone: '+1 (555) 333-4444',
      department: 'English',
      position: 'Teacher',
      hire_date: '2022-09-01',
      status: 'active',
      salary: 58000,
      subjects: ['English Literature', 'Creative Writing', 'ESL'],
      qualifications: ['M.A. English Literature', 'TESOL Certificate'],
      experience_years: 5,
      performance_rating: 4.7,
      classes_assigned: 6,
      students_count: 142,
      address: '987 Literary Lane, Springfield, IL 62706',
      emergency_contact: 'David Chen - +1 (555) 333-4445',
      contract_type: 'full_time'
    }
  ]);

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([
    {
      id: 'fin-001',
      type: 'income',
      category: 'Tuition Fees',
      description: 'Q1 2025 Tuition Collection',
      amount: 125000,
      date: '2025-01-15',
      status: 'completed',
      reference_number: 'TUI-2025-001',
      payment_method: 'Bank Transfer',
      notes: 'Regular quarterly tuition collection',
      created_by: 'Sarah Johnson'
    },
    {
      id: 'fin-002',
      type: 'expense',
      category: 'Salaries',
      description: 'January 2025 Teacher Salaries',
      amount: 45000,
      date: '2025-01-31',
      status: 'completed',
      reference_number: 'SAL-2025-001',
      payment_method: 'Direct Deposit',
      notes: 'Monthly salary disbursement',
      created_by: 'Finance Department'
    },
    {
      id: 'fin-003',
      type: 'expense',
      category: 'Utilities',
      description: 'Electricity and Water Bills',
      amount: 3500,
      date: '2025-01-20',
      status: 'completed',
      reference_number: 'UTL-2025-001',
      payment_method: 'Online Payment',
      notes: 'Monthly utility expenses',
      created_by: 'Admin Office'
    },
    {
      id: 'fin-004',
      type: 'income',
      category: 'Laboratory Fees',
      description: 'Science Lab Equipment Usage',
      amount: 8500,
      date: '2025-01-18',
      status: 'completed',
      reference_number: 'LAB-2025-001',
      payment_method: 'Cash',
      notes: 'Additional lab fees collection',
      created_by: 'Science Department'
    },
    {
      id: 'fin-005',
      type: 'expense',
      category: 'Supplies',
      description: 'Office and Teaching Supplies',
      amount: 2800,
      date: '2025-01-22',
      status: 'pending',
      reference_number: 'SUP-2025-001',
      payment_method: 'Purchase Order',
      notes: 'Monthly supplies procurement',
      created_by: 'Procurement Team'
    }
  ]);

  // Analytics data
  const analyticsData = {
    overview: {
      totalStudents: 750,
      totalTeachers: 45,
      totalRevenue: 125000,
      totalExpenses: 89500,
      attendanceRate: 96.8,
      satisfactionScore: 4.6,
      graduationRate: 98.5,
      monthlyGrowth: 8.5
    },
    trends: {
      studentGrowth: [680, 695, 710, 725, 740, 750],
      teacherGrowth: [40, 41, 42, 43, 44, 45],
      revenueGrowth: [110000, 115000, 118000, 120000, 122000, 125000],
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    },
    gradeDistribution: [
      { grade: 'Kindergarten', students: 85, percentage: 11.3 },
      { grade: 'Grade 1', students: 92, percentage: 12.3 },
      { grade: 'Grade 2', students: 88, percentage: 11.7 },
      { grade: 'Grade 3', students: 95, percentage: 12.7 },
      { grade: 'Grade 4', students: 82, percentage: 10.9 },
      { grade: 'Grade 5', students: 78, percentage: 10.4 },
      { grade: 'Grade 6', students: 75, percentage: 10.0 },
      { grade: 'Grade 7', students: 80, percentage: 10.7 },
      { grade: 'Grade 8', students: 75, percentage: 10.0 }
    ],
    topPerformers: [
      { name: 'James Wilson', grade: 'Grade 11', gpa: 3.92, subject: 'Mathematics' },
      { name: 'Emma Johnson', grade: 'Grade 10', gpa: 3.85, subject: 'Science' },
      { name: 'Sophia Davis', grade: 'Grade 9', gpa: 3.67, subject: 'English' }
    ],
    departments: [
      { name: 'Mathematics', teachers: 8, students: 180, budget: 25000 },
      { name: 'Science', teachers: 7, students: 165, budget: 30000 },
      { name: 'English', teachers: 6, students: 150, budget: 20000 },
      { name: 'Social Studies', teachers: 5, students: 125, budget: 18000 },
      { name: 'Arts', teachers: 4, students: 100, budget: 15000 },
      { name: 'Physical Education', teachers: 3, students: 200, budget: 12000 },
      { name: 'Technology', teachers: 2, students: 80, budget: 22000 },
      { name: 'Music', teachers: 2, students: 90, budget: 10000 }
    ]
  };

  const handleAddRecord = (type: 'student' | 'teacher' | 'finance') => {
    setModalType(type);
    setSelectedRecord(null);
    setShowAddModal(true);
  };

  const handleEditRecord = (record: any, type: 'student' | 'teacher' | 'finance') => {
    setModalType(type);
    setSelectedRecord(record);
    setShowAddModal(true);
  };

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleDeleteRecord = (id: string, type: 'student' | 'teacher' | 'finance') => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (type === 'student') {
        setStudents(prev => prev.filter(s => s.id !== id));
      } else if (type === 'teacher') {
        setTeachers(prev => prev.filter(t => t.id !== id));
      } else if (type === 'finance') {
        setFinancialRecords(prev => prev.filter(f => f.id !== id));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'text-green-600 bg-green-100';
      case 'inactive': case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'graduated': case 'cancelled': return 'text-blue-600 bg-blue-100';
      case 'transferred': case 'on_leave': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredFinancials = financialRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50" style={{ color: customTheme.textColor }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {customTheme.logoUrl ? (
                <img
                  src={customTheme.logoUrl}
                  alt="School Logo"
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: customTheme.primaryColor }}>
                  <Building className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold" style={{ color: customTheme.textColor }}>
                  {customTheme.schoolName}
                </h1>
                <p className="text-sm text-gray-600">School Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                style={{ color: customTheme.textColor }}
              >
                <Settings className="h-5 w-5" />
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">School Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* School Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={customTheme.schoolName}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, schoolName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {customTheme.logoUrl ? (
                      <img
                        src={customTheme.logoUrl}
                        alt="Logo"
                        className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setCustomTheme(prev => ({ ...prev, logoUrl: e.target?.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Color Customization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Color Theme</span>
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customTheme.primaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.primaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customTheme.secondaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.secondaryColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customTheme.accentColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.accentColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={customTheme.textColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTheme.textColor}
                        onChange={(e) => setCustomTheme(prev => ({ ...prev, textColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                  style={{ backgroundColor: customTheme.primaryColor }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'students', label: 'Students', icon: GraduationCap },
              { id: 'teachers', label: 'Teachers', icon: Users },
              { id: 'finances', label: 'Finances', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                style={activeTab === tab.id ? { backgroundColor: customTheme.primaryColor } : {}}
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold" style={{ color: customTheme.primaryColor }}>
                      {analyticsData.overview.totalStudents}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+{analyticsData.overview.monthlyGrowth}%</span>
                    </div>
                  </div>
                  <GraduationCap className="h-12 w-12" style={{ color: customTheme.primaryColor }} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                    <p className="text-3xl font-bold" style={{ color: customTheme.secondaryColor }}>
                      {analyticsData.overview.totalTeachers}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+2.3%</span>
                    </div>
                  </div>
                  <Users className="h-12 w-12" style={{ color: customTheme.secondaryColor }} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold" style={{ color: customTheme.accentColor }}>
                      ${analyticsData.overview.totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+4.1%</span>
                    </div>
                  </div>
                  <DollarSign className="h-12 w-12" style={{ color: customTheme.accentColor }} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      {analyticsData.overview.attendanceRate}%
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+1.2%</span>
                    </div>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold" style={{ color: customTheme.textColor }}>Recent Activities</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: customTheme.primaryColor }}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: customTheme.textColor }}>New student enrolled</p>
                        <p className="text-xs text-gray-500">Emma Johnson - Grade 10A</p>
                      </div>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: customTheme.textColor }}>Payment received</p>
                        <p className="text-xs text-gray-500">$2,500 tuition payment</p>
                      </div>
                      <span className="text-xs text-gray-400">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: customTheme.textColor }}>Teacher hired</p>
                        <p className="text-xs text-gray-500">Dr. Sarah Mitchell - Mathematics</p>
                      </div>
                      <span className="text-xs text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold" style={{ color: customTheme.textColor }}>Quick Stats</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Student Satisfaction</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(analyticsData.overview.satisfactionScore / 5) * 100}%`,
                              backgroundColor: customTheme.secondaryColor 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analyticsData.overview.satisfactionScore}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Graduation Rate</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${analyticsData.overview.graduationRate}%`,
                              backgroundColor: customTheme.accentColor 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analyticsData.overview.graduationRate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Growth</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${analyticsData.overview.monthlyGrowth * 10}%`,
                              backgroundColor: customTheme.primaryColor 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">+{analyticsData.overview.monthlyGrowth}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Time Frame Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>Analytics Dashboard</h2>
              <select
                value={selectedTimeFrame}
                onChange={(e) => setSelectedTimeFrame(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Average Grade</p>
                    <p className="text-3xl font-bold">87.3%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+2.1%</span>
                    </div>
                  </div>
                  <Award className="h-12 w-12 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Collection Rate</p>
                    <p className="text-3xl font-bold">94.2%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+1.8%</span>
                    </div>
                  </div>
                  <CreditCard className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Graduation Rate</p>
                    <p className="text-3xl font-bold">98.5%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+0.5%</span>
                    </div>
                  </div>
                  <Target className="h-12 w-12 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Monthly Growth</p>
                    <p className="text-3xl font-bold">8.5%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+1.2%</span>
                    </div>
                  </div>
                  <Activity className="h-12 w-12 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Revenue vs Expenses */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: customTheme.textColor }}>Revenue vs Expenses</h3>
                <div className="space-y-4">
                  {analyticsData.trends.months.map((month, index) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{month}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${(analyticsData.trends.revenueGrowth[index] / 125000) * 100}%`,
                                backgroundColor: customTheme.secondaryColor 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            ${analyticsData.trends.revenueGrowth[index].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: customTheme.textColor }}>Grade Distribution</h3>
                <div className="space-y-3">
                  {analyticsData.gradeDistribution.map((grade, index) => (
                    <div key={grade.grade} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{grade.grade}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${grade.percentage * 8}%`,
                              backgroundColor: customTheme.primaryColor 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{grade.students}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performers and Department Performance */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: customTheme.textColor }}>Top Performers</h3>
                <div className="space-y-4">
                  {analyticsData.topPerformers.map((student, index) => (
                    <div key={student.name} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: customTheme.accentColor }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: customTheme.textColor }}>{student.name}</p>
                        <p className="text-sm text-gray-500">{student.grade} • {student.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: customTheme.primaryColor }}>{student.gpa}</p>
                        <p className="text-xs text-gray-500">GPA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4" style={{ color: customTheme.textColor }}>Department Performance</h3>
                <div className="space-y-4">
                  {analyticsData.departments.slice(0, 5).map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: customTheme.textColor }}>{dept.name}</p>
                        <p className="text-sm text-gray-500">{dept.teachers} teachers • {dept.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: customTheme.secondaryColor }}>
                          ${dept.budget.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Budget</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Header with Search and Filters */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>Student Management</h2>
              <button
                onClick={() => handleAddRecord('student')}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
                style={{ backgroundColor: customTheme.primaryColor }}
              >
                <Plus className="h-5 w-5" />
                <span>Add Student</span>
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search students..."
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>
                <div>
                  <button
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade & Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GPA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fees Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {student.first_name[0]}{student.last_name[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium" style={{ color: customTheme.textColor }}>
                                {student.first_name} {student.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{student.student_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm" style={{ color: customTheme.textColor }}>{student.grade_level}</div>
                          <div className="text-sm text-gray-500">Section {student.section}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium" style={{ color: customTheme.primaryColor }}>
                            {student.gpa.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            {student.attendance_rate.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${student.fees_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${student.fees_balance.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(student)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditRecord(student, 'student')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(student.id, 'student')}
                              className="text-red-600 hover:text-red-900"
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

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>Teacher Management</h2>
              <button
                onClick={() => handleAddRecord('teacher')}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
                style={{ backgroundColor: customTheme.secondaryColor }}
              >
                <Plus className="h-5 w-5" />
                <span>Add Teacher</span>
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search teachers..."
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {teacher.first_name[0]}{teacher.last_name[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium" style={{ color: customTheme.textColor }}>
                                {teacher.first_name} {teacher.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{teacher.employee_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm" style={{ color: customTheme.textColor }}>{teacher.department}</div>
                          <div className="text-sm text-gray-500">{teacher.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium" style={{ color: customTheme.secondaryColor }}>
                            {teacher.experience_years} years
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium">{teacher.performance_rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm" style={{ color: customTheme.textColor }}>
                            {teacher.classes_assigned} classes
                          </div>
                          <div className="text-sm text-gray-500">{teacher.students_count} students</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                            {teacher.status.replace('_', ' ').charAt(0).toUpperCase() + teacher.status.replace('_', ' ').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(teacher)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditRecord(teacher, 'teacher')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(teacher.id, 'teacher')}
                              className="text-red-600 hover:text-red-900"
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

        {/* Finances Tab */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>Financial Management</h2>
              <button
                onClick={() => handleAddRecord('finance')}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
                style={{ backgroundColor: customTheme.accentColor }}
              >
                <Plus className="h-5 w-5" />
                <span>Add Transaction</span>
              </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${financialRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${financialRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold" style={{ color: customTheme.accentColor }}>
                      ${(financialRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0) - 
                         financialRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0)).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8" style={{ color: customTheme.accentColor }} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      ${financialRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search transactions..."
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Records Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFinancials.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium" style={{ color: customTheme.textColor }}>
                              {record.description}
                            </div>
                            <div className="text-sm text-gray-500">{record.reference_number}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">{record.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            record.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.type === 'income' ? '+' : '-'}${record.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm" style={{ color: customTheme.textColor }}>
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(record)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditRecord(record, 'finance')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record.id, 'finance')}
                              className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>
                  {selectedRecord ? 'Edit' : 'Add'} {modalType?.charAt(0).toUpperCase() + modalType?.slice(1)}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  {modalType === 'student' && 'Add or edit student information including personal details, academic records, and contact information.'}
                  {modalType === 'teacher' && 'Add or edit teacher information including qualifications, department assignment, and performance metrics.'}
                  {modalType === 'finance' && 'Add or edit financial transactions including income, expenses, and payment records.'}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    This is a demo interface. In the full version, you would have comprehensive forms for data entry and editing.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 text-white py-3 rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: customTheme.primaryColor }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>
                  {selectedRecord.first_name ? 
                    `${selectedRecord.first_name} ${selectedRecord.last_name}` : 
                    selectedRecord.description || 'Record Details'
                  }
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Details */}
                {selectedRecord.student_id && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Student ID</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.student_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Grade & Section</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.grade_level} - Section {selectedRecord.section}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GPA</label>
                      <p className="text-sm font-bold" style={{ color: customTheme.primaryColor }}>{selectedRecord.gpa?.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parent Contact</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.parent_name}</p>
                      <p className="text-xs text-gray-500">{selectedRecord.parent_email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fees Balance</label>
                      <p className={`text-sm font-bold ${selectedRecord.fees_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${selectedRecord.fees_balance?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Teacher Details */}
                {selectedRecord.employee_id && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.employee_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.experience_years} years</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Performance Rating</label>
                      <p className="text-sm font-bold" style={{ color: customTheme.secondaryColor }}>{selectedRecord.performance_rating?.toFixed(1)}/5.0</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Classes Assigned</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.classes_assigned} classes, {selectedRecord.students_count} students</p>
                    </div>
                  </div>
                )}

                {/* Financial Record Details */}
                {selectedRecord.reference_number && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.reference_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className={`text-sm font-bold ${selectedRecord.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRecord.type === 'income' ? '+' : '-'}${selectedRecord.amount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.payment_method}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-sm" style={{ color: customTheme.textColor }}>{selectedRecord.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEditRecord(selectedRecord, modalType || 'student');
                    }}
                    className="flex-1 text-white py-3 rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: customTheme.primaryColor }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolOwnerDashboard;