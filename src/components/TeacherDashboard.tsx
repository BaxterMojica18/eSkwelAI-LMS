import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Award,
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  LogOut,
  QrCode,
  GraduationCap,
  X,
  Save,
  Copy,
  Printer
} from 'lucide-react';

interface Section {
  id: string;
  name: string;
  grade_level: string;
  subject: string;
  student_count: number;
  school_year: string;
  capacity: number;
  description?: string;
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  due_date: string | null;
  is_published: boolean;
  total_points: number;
  created_at: string;
  section_name: string;
  section_id: string;
  description?: string;
  instructions?: string;
  time_limit_minutes?: number;
  passing_score: number;
}

interface LearningModule {
  id: string;
  title: string;
  type: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  section_name: string;
  section_id: string;
  description?: string;
  content_url?: string;
  duration_minutes?: number;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  section: string;
  section_id: string;
  enrollment_date: string;
  status: 'active' | 'inactive';
  grade_level: string;
  parent_name?: string;
  parent_contact?: string;
}

interface QRCode {
  id: string;
  section_id: string;
  section_name: string;
  qr_code: string;
  title: string;
  description: string;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface TeacherDashboardProps {
  onSignOut: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sections, setSections] = useState<Section[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showCreateAssessmentModal, setShowCreateAssessmentModal] = useState(false);
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [showCreateQRModal, setShowCreateQRModal] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    section_id: '',
    parent_name: '',
    parent_contact: ''
  });

  const [classForm, setClassForm] = useState({
    name: '',
    grade_level: '',
    subject: '',
    capacity: 30,
    description: ''
  });

  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    type: 'quiz',
    section_id: '',
    description: '',
    instructions: '',
    total_points: 100,
    passing_score: 70,
    time_limit_minutes: 60,
    due_date: ''
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    type: 'video',
    section_id: '',
    description: '',
    content_url: '',
    duration_minutes: 30
  });

  const [qrForm, setQrForm] = useState({
    section_id: '',
    title: '',
    description: '',
    max_uses: '',
    expires_at: ''
  });

  // Sample data for demonstration
  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample sections
    const sampleSections: Section[] = [
      {
        id: '1',
        name: 'Grade 1-A',
        grade_level: 'Grade 1',
        subject: 'Mathematics',
        student_count: 25,
        school_year: '2025',
        capacity: 30,
        description: 'Elementary Mathematics for Grade 1 students'
      },
      {
        id: '2',
        name: 'Grade 2-B',
        grade_level: 'Grade 2',
        subject: 'Science',
        student_count: 22,
        school_year: '2025',
        capacity: 25,
        description: 'Basic Science concepts for Grade 2 students'
      },
      {
        id: '3',
        name: 'Grade 3-A',
        grade_level: 'Grade 3',
        subject: 'English',
        student_count: 28,
        school_year: '2025',
        capacity: 30,
        description: 'English Language Arts for Grade 3 students'
      }
    ];

    // Sample assessments
    const sampleAssessments: Assessment[] = [
      {
        id: '1',
        title: 'Math Quiz 1',
        type: 'Quiz',
        due_date: '2025-02-15',
        is_published: true,
        total_points: 100,
        created_at: '2025-01-20',
        section_name: 'Grade 1-A',
        section_id: '1',
        description: 'Basic addition and subtraction',
        instructions: 'Complete all problems and show your work',
        time_limit_minutes: 30,
        passing_score: 70
      },
      {
        id: '2',
        title: 'Science Test - Plants',
        type: 'Test',
        due_date: '2025-02-20',
        is_published: true,
        total_points: 150,
        created_at: '2025-01-22',
        section_name: 'Grade 2-B',
        section_id: '2',
        description: 'Understanding plant biology',
        instructions: 'Answer all questions about plant parts and functions',
        time_limit_minutes: 45,
        passing_score: 105
      },
      {
        id: '3',
        title: 'Reading Comprehension',
        type: 'Assessment',
        due_date: '2025-02-25',
        is_published: false,
        total_points: 80,
        created_at: '2025-01-25',
        section_name: 'Grade 3-A',
        section_id: '3',
        description: 'Reading comprehension skills test',
        instructions: 'Read the passages and answer the questions',
        time_limit_minutes: 60,
        passing_score: 56
      }
    ];

    // Sample learning modules
    const sampleModules: LearningModule[] = [
      {
        id: '1',
        title: 'Introduction to Numbers',
        type: 'Video',
        is_published: true,
        order_index: 1,
        created_at: '2025-01-15',
        section_name: 'Grade 1-A',
        section_id: '1',
        description: 'Basic number recognition and counting',
        content_url: 'https://example.com/video1',
        duration_minutes: 15
      },
      {
        id: '2',
        title: 'Addition Basics',
        type: 'PDF',
        is_published: true,
        order_index: 2,
        created_at: '2025-01-18',
        section_name: 'Grade 1-A',
        section_id: '1',
        description: 'Learning to add single digits',
        content_url: 'https://example.com/pdf1'
      },
      {
        id: '3',
        title: 'Plant Parts',
        type: 'Video',
        is_published: true,
        order_index: 1,
        created_at: '2025-01-20',
        section_name: 'Grade 2-B',
        section_id: '2',
        description: 'Understanding different parts of plants',
        content_url: 'https://example.com/video2',
        duration_minutes: 20
      }
    ];

    // Sample students
    const sampleStudents: Student[] = [
      {
        id: '1',
        first_name: 'Emma',
        last_name: 'Smith',
        email: 'emma.smith@demoschool.edu',
        section: 'Grade 1-A',
        section_id: '1',
        enrollment_date: '2025-01-15',
        status: 'active',
        grade_level: 'Grade 1',
        parent_name: 'Jennifer Smith',
        parent_contact: '+1 (555) 456-7890'
      },
      {
        id: '2',
        first_name: 'James',
        last_name: 'Smith',
        email: 'james.smith@demoschool.edu',
        section: 'Grade 2-B',
        section_id: '2',
        enrollment_date: '2025-01-15',
        status: 'active',
        grade_level: 'Grade 2',
        parent_name: 'Jennifer Smith',
        parent_contact: '+1 (555) 456-7890'
      },
      {
        id: '3',
        first_name: 'Michael',
        last_name: 'Johnson',
        email: 'michael.johnson@demoschool.edu',
        section: 'Grade 3-A',
        section_id: '3',
        enrollment_date: '2025-01-10',
        status: 'active',
        grade_level: 'Grade 3',
        parent_name: 'Robert Johnson',
        parent_contact: '+1 (555) 567-8901'
      },
      {
        id: '4',
        first_name: 'Sarah',
        last_name: 'Davis',
        email: 'sarah.davis@demoschool.edu',
        section: 'Grade 1-A',
        section_id: '1',
        enrollment_date: '2025-01-12',
        status: 'active',
        grade_level: 'Grade 1',
        parent_name: 'Lisa Davis',
        parent_contact: '+1 (555) 678-9012'
      }
    ];

    // Sample QR codes
    const sampleQRCodes: QRCode[] = [
      {
        id: '1',
        section_id: '1',
        section_name: 'Grade 1-A',
        qr_code: 'MATH_2025_G1A',
        title: 'Math Class Enrollment',
        description: 'Join Grade 1-A Mathematics class',
        max_uses: 30,
        current_uses: 5,
        expires_at: '2025-12-31',
        is_active: true,
        created_at: '2025-01-15'
      },
      {
        id: '2',
        section_id: '2',
        section_name: 'Grade 2-B',
        qr_code: 'SCI_2025_G2B',
        title: 'Science Class Enrollment',
        description: 'Join Grade 2-B Science class',
        max_uses: 25,
        current_uses: 3,
        expires_at: '2025-12-31',
        is_active: true,
        created_at: '2025-01-18'
      }
    ];

    setSections(sampleSections);
    setAssessments(sampleAssessments);
    setModules(sampleModules);
    setStudents(sampleStudents);
    setQrCodes(sampleQRCodes);
  };

  const stats = {
    totalSections: sections.length,
    totalStudents: students.length,
    totalAssessments: assessments.length,
    totalModules: modules.length,
    publishedAssessments: assessments.filter(a => a.is_published).length,
    publishedModules: modules.filter(m => m.is_published).length,
    activeQRCodes: qrCodes.filter(q => q.is_active).length
  };

  // Form handlers
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Date.now().toString(),
      ...studentForm,
      section: sections.find(s => s.id === studentForm.section_id)?.name || '',
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'active',
      grade_level: sections.find(s => s.id === studentForm.section_id)?.grade_level || ''
    };
    
    setStudents(prev => [...prev, newStudent]);
    
    // Update section student count
    setSections(prev => prev.map(section => 
      section.id === studentForm.section_id 
        ? { ...section, student_count: section.student_count + 1 }
        : section
    ));
    
    setStudentForm({
      first_name: '',
      last_name: '',
      email: '',
      section_id: '',
      parent_name: '',
      parent_contact: ''
    });
    setShowAddStudentModal(false);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newSection: Section = {
      id: Date.now().toString(),
      name: classForm.name,
      grade_level: classForm.grade_level,
      subject: classForm.subject,
      student_count: 0,
      school_year: '2025',
      capacity: classForm.capacity,
      description: classForm.description
    };
    
    setSections(prev => [...prev, newSection]);
    setClassForm({
      name: '',
      grade_level: '',
      subject: '',
      capacity: 30,
      description: ''
    });
    setShowAddClassModal(false);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      ...assessmentForm,
      section_name: sections.find(s => s.id === assessmentForm.section_id)?.name || '',
      is_published: false,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setAssessments(prev => [...prev, newAssessment]);
    setAssessmentForm({
      title: '',
      type: 'quiz',
      section_id: '',
      description: '',
      instructions: '',
      total_points: 100,
      passing_score: 70,
      time_limit_minutes: 60,
      due_date: ''
    });
    setShowCreateAssessmentModal(false);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    const newModule: LearningModule = {
      id: Date.now().toString(),
      ...moduleForm,
      section_name: sections.find(s => s.id === moduleForm.section_id)?.name || '',
      is_published: false,
      order_index: modules.filter(m => m.section_id === moduleForm.section_id).length + 1,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setModules(prev => [...prev, newModule]);
    setModuleForm({
      title: '',
      type: 'video',
      section_id: '',
      description: '',
      content_url: '',
      duration_minutes: 30
    });
    setShowCreateModuleModal(false);
  };

  const handleCreateQR = (e: React.FormEvent) => {
    e.preventDefault();
    const newQR: QRCode = {
      id: Date.now().toString(),
      ...qrForm,
      section_name: sections.find(s => s.id === qrForm.section_id)?.name || '',
      qr_code: `QR_${Date.now()}`,
      current_uses: 0,
      max_uses: qrForm.max_uses ? parseInt(qrForm.max_uses) : null,
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    setQrCodes(prev => [...prev, newQR]);
    setQrForm({
      section_id: '',
      title: '',
      description: '',
      max_uses: '',
      expires_at: ''
    });
    setShowCreateQRModal(false);
  };

  const toggleAssessmentStatus = (id: string) => {
    setAssessments(prev => prev.map(assessment => 
      assessment.id === id 
        ? { ...assessment, is_published: !assessment.is_published }
        : assessment
    ));
  };

  const toggleModuleStatus = (id: string) => {
    setModules(prev => prev.map(module => 
      module.id === id 
        ? { ...module, is_published: !module.is_published }
        : module
    ));
  };

  const toggleQRStatus = (id: string) => {
    setQrCodes(prev => prev.map(qr => 
      qr.id === id 
        ? { ...qr, is_active: !qr.is_active }
        : qr
    ));
  };

  const deleteItem = (id: string, type: 'assessment' | 'module' | 'student' | 'qr') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    switch (type) {
      case 'assessment':
        setAssessments(prev => prev.filter(a => a.id !== id));
        break;
      case 'module':
        setModules(prev => prev.filter(m => m.id !== id));
        break;
      case 'student':
        const student = students.find(s => s.id === id);
        setStudents(prev => prev.filter(s => s.id !== id));
        if (student) {
          setSections(prev => prev.map(section => 
            section.id === student.section_id 
              ? { ...section, student_count: Math.max(0, section.student_count - 1) }
              : section
          ));
        }
        break;
      case 'qr':
        setQrCodes(prev => prev.filter(q => q.id !== id));
        break;
    }
  };

  const copyQRCode = (qrCode: string) => {
    const enrollmentUrl = `${window.location.origin}/enroll/${qrCode}`;
    navigator.clipboard.writeText(enrollmentUrl);
    alert('QR code link copied to clipboard!');
  };

  const downloadQRCode = (qr: QRCode) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/enroll/${qr.qr_code}`)}`;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${qr.title.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Michael Davis!</p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'sections', label: 'My Classes', icon: Users },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'assessments', label: 'Assessments', icon: FileText },
              { id: 'modules', label: 'Learning Modules', icon: BookOpen },
              { id: 'qr-enrollment', label: 'QR Enrollment', icon: QrCode },
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Classes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSections}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                  <Award className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assessments</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAssessments}</p>
                    <p className="text-xs text-gray-500">{stats.publishedAssessments} published</p>
                  </div>
                  <FileText className="h-12 w-12 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Learning Modules</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalModules}</p>
                    <p className="text-xs text-gray-500">{stats.publishedModules} published</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Student</span>
                </button>
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Class</span>
                </button>
                <button
                  onClick={() => setShowCreateAssessmentModal(true)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Assessment</span>
                </button>
                <button
                  onClick={() => setShowCreateQRModal(true)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <QrCode className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Generate QR</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Assessments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Assessments</h3>
                    <button
                      onClick={() => setActiveTab('assessments')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {assessments.length > 0 ? (
                    <div className="space-y-4">
                      {assessments.slice(0, 5).map((assessment) => (
                        <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                            <p className="text-sm text-gray-600">{assessment.section_name} • {assessment.type}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assessment.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assessment.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No assessments yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Modules */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Learning Modules</h3>
                    <button
                      onClick={() => setActiveTab('modules')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {modules.length > 0 ? (
                    <div className="space-y-4">
                      {modules.slice(0, 5).map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-600">{module.section_name} • {module.type}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              module.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {module.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No learning modules yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
              <button 
                onClick={() => setShowAddClassModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Class</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                      <p className="text-gray-600">{section.subject}</p>
                      {section.description && (
                        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{section.student_count}/{section.capacity} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{section.school_year}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sections.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                <p className="text-gray-600 mb-4">Create your first class to get started</p>
                <button 
                  onClick={() => setShowAddClassModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Class
                </button>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Students</h2>
              <button 
                onClick={() => setShowAddStudentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment Date
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
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.section}</div>
                          <div className="text-sm text-gray-500">{student.grade_level}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{student.parent_name}</div>
                            <div className="text-sm text-gray-500">{student.parent_contact}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(student.enrollment_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteItem(student.id, 'student')}
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

              {students.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
                  <p className="text-gray-600 mb-4">Add your first student to get started</p>
                  <button 
                    onClick={() => setShowAddStudentModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Assessments</h2>
              <button 
                onClick={() => setShowCreateAssessmentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Assessment</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assessments.map((assessment) => (
                      <tr key={assessment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                            <div className="text-sm text-gray-500">{assessment.total_points} points</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{assessment.section_name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{assessment.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleAssessmentStatus(assessment.id)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                              assessment.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {assessment.is_published ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : 'No due date'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteItem(assessment.id, 'assessment')}
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

              {assessments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                  <p className="text-gray-600 mb-4">Create your first assessment to get started</p>
                  <button 
                    onClick={() => setShowCreateAssessmentModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Assessment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Learning Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Learning Modules</h2>
              <button 
                onClick={() => setShowCreateModuleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{module.section_name}</p>
                        {module.description && (
                          <p className="text-sm text-gray-500 mb-3">{module.description}</p>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            module.type === 'Video' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {module.type}
                          </span>
                          <button
                            onClick={() => toggleModuleStatus(module.id)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                              module.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {module.is_published ? 'Published' : 'Draft'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteItem(module.id, 'module')}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">Order: {module.order_index}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {modules.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No learning modules yet</h3>
                <p className="text-gray-600 mb-4">Create your first learning module to get started</p>
                <button 
                  onClick={() => setShowCreateModuleModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Module
                </button>
              </div>
            )}
          </div>
        )}

        {/* QR Enrollment Tab */}
        {activeTab === 'qr-enrollment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">QR Code Enrollment</h2>
              <button 
                onClick={() => setShowCreateQRModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create QR Code</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrCodes.map((qr) => (
                <div key={qr.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  {/* QR Code Image */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/enroll/${qr.qr_code}`)}`}
                      alt="QR Code"
                      className="rounded-lg border"
                    />
                  </div>

                  {/* QR Code Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{qr.title}</h3>
                      <p className="text-sm text-gray-600">{qr.section_name}</p>
                      {qr.description && (
                        <p className="text-sm text-gray-500 mt-1">{qr.description}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${qr.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <button
                        onClick={() => toggleQRStatus(qr.id)}
                        className={`text-sm font-medium cursor-pointer ${qr.is_active ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {qr.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Uses:</span>
                        <span className="ml-1 font-medium">
                          {qr.current_uses}
                          {qr.max_uses && ` / ${qr.max_uses}`}
                        </span>
                      </div>
                      {qr.expires_at && (
                        <div>
                          <span className="text-gray-500">Expires:</span>
                          <span className="ml-1 font-medium">
                            {new Date(qr.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyQRCode(qr.qr_code)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy enrollment link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadQRCode(qr)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download QR code"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(qr.id, 'qr')}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete QR code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {qrCodes.length === 0 && (
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
                <p className="text-gray-600 mb-4">Create your first QR code to start enrolling students</p>
                <button 
                  onClick={() => setShowCreateQRModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create QR Code
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value="Michael"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value="Davis"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value="teacher@demoschool.edu"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value="Teacher"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Student</h3>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentForm.first_name}
                      onChange={(e) => setStudentForm(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentForm.last_name}
                      onChange={(e) => setStudentForm(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="student@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    required
                    value={studentForm.section_id}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, section_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a class</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name} - {section.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    value={studentForm.parent_name}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parent_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Parent/Guardian name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Contact
                  </label>
                  <input
                    type="tel"
                    value={studentForm.parent_contact}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parent_contact: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Class</h3>
                <button
                  onClick={() => setShowAddClassModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    required
                    value={classForm.name}
                    onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Grade 1-A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <select
                    required
                    value={classForm.grade_level}
                    onChange={(e) => setClassForm(prev => ({ ...prev, grade_level: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select grade level</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={classForm.subject}
                    onChange={(e) => setClassForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics, Science, English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={classForm.capacity}
                    onChange={(e) => setClassForm(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={classForm.description}
                    onChange={(e) => setClassForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the class"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Assessment Modal */}
      {showCreateAssessmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Assessment</h3>
                <button
                  onClick={() => setShowCreateAssessmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAssessment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={assessmentForm.title}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Math Quiz 1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      required
                      value={assessmentForm.type}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="quiz">Quiz</option>
                      <option value="test">Test</option>
                      <option value="exam">Exam</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select
                      required
                      value={assessmentForm.section_id}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, section_id: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select class</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={assessmentForm.description}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the assessment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={assessmentForm.instructions}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Instructions for students"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={assessmentForm.total_points}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, total_points: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Score
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={assessmentForm.passing_score}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (min)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={assessmentForm.time_limit_minutes}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, time_limit_minutes: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={assessmentForm.due_date}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateAssessmentModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Module Modal */}
      {showCreateModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Learning Module</h3>
                <button
                  onClick={() => setShowCreateModuleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateModule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Introduction to Numbers"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      required
                      value={moduleForm.type}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="presentation">Presentation</option>
                      <option value="interactive">Interactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select
                      required
                      value={moduleForm.section_id}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, section_id: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select class</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the learning module"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content URL
                  </label>
                  <input
                    type="url"
                    value={moduleForm.content_url}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, content_url: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/content"
                  />
                </div>

                {moduleForm.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={moduleForm.duration_minutes}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModuleModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create QR Code Modal */}
      {showCreateQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create QR Code</h3>
                <button
                  onClick={() => setShowCreateQRModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateQR} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    required
                    value={qrForm.section_id}
                    onChange={(e) => setQrForm(prev => ({ ...prev, section_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a class</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name} - {section.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={qrForm.title}
                    onChange={(e) => setQrForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Math Class Enrollment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={qrForm.description}
                    onChange={(e) => setQrForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional information about this enrollment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Uses (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={qrForm.max_uses}
                    onChange={(e) => setQrForm(prev => ({ ...prev, max_uses: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={qrForm.expires_at}
                    onChange={(e) => setQrForm(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateQRModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create QR Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;