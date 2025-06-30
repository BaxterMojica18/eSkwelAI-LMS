import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  DollarSign,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Search,
  Filter,
  Download,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Send,
  Eye,
  Star,
  TrendingUp,
  Award,
  Target,
  RefreshCw,
  LogOut,
  Plus,
  QrCode,
  Scan,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Printer
} from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  grade_level: string;
  section: string;
  profile_image_url?: string;
  gpa: number;
  total_credits: number;
  enrollment_date: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher_name: string;
  teacher_email: string;
  schedule: string;
  room: string;
  credits: number;
  description: string;
  enrolled: boolean;
  enrollment_date?: string;
  grade?: string;
  status: 'active' | 'completed' | 'dropped';
}

interface Assessment {
  id: string;
  subject_id: string;
  subject_name: string;
  title: string;
  type: 'quiz' | 'exam' | 'assignment';
  description: string;
  total_points: number;
  time_limit: number;
  due_date: string;
  status: 'upcoming' | 'available' | 'submitted' | 'graded' | 'overdue';
  score?: number;
  grade?: string;
  feedback?: string;
  attempts_allowed: number;
  attempts_used: number;
}

interface Fee {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  category: 'tuition' | 'books' | 'lab' | 'activity' | 'miscellaneous';
  paid_date?: string;
  payment_method?: string;
  receipt_number?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'academic' | 'event' | 'urgent' | 'general';
  is_pinned: boolean;
  attachments?: string[];
  target_audience: string[];
}

interface StudentDashboardProps {
  onSignOut: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [student, setStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample student data
    const sampleStudent: Student = {
      id: 'student-001',
      first_name: 'Alex',
      last_name: 'Johnson',
      email: 'alex.johnson@demoschool.edu',
      student_id: 'STU2025001',
      grade_level: 'Grade 10',
      section: 'A',
      gpa: 3.75,
      total_credits: 24,
      enrollment_date: '2024-09-01'
    };

    // Sample subjects
    const sampleSubjects: Subject[] = [
      {
        id: 'subj-001',
        name: 'Advanced Mathematics',
        code: 'MATH301',
        teacher_name: 'Dr. Sarah Wilson',
        teacher_email: 'sarah.wilson@demoschool.edu',
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        room: 'Room 201',
        credits: 4,
        description: 'Advanced topics in algebra, geometry, and calculus',
        enrolled: true,
        enrollment_date: '2024-09-01',
        grade: 'A-',
        status: 'active'
      },
      {
        id: 'subj-002',
        name: 'Physics Laboratory',
        code: 'PHYS201',
        teacher_name: 'Prof. Michael Chen',
        teacher_email: 'michael.chen@demoschool.edu',
        schedule: 'Tue, Thu - 2:00 PM',
        room: 'Lab 105',
        credits: 3,
        description: 'Hands-on physics experiments and theory application',
        enrolled: true,
        enrollment_date: '2024-09-01',
        grade: 'B+',
        status: 'active'
      },
      {
        id: 'subj-003',
        name: 'English Literature',
        code: 'ENG401',
        teacher_name: 'Ms. Emily Rodriguez',
        teacher_email: 'emily.rodriguez@demoschool.edu',
        schedule: 'Mon, Wed - 11:00 AM',
        room: 'Room 305',
        credits: 3,
        description: 'Analysis of classic and contemporary literature',
        enrolled: true,
        enrollment_date: '2024-09-01',
        grade: 'A',
        status: 'active'
      }
    ];

    // Sample assessments
    const sampleAssessments: Assessment[] = [
      {
        id: 'assess-001',
        subject_id: 'subj-001',
        subject_name: 'Advanced Mathematics',
        title: 'Calculus Midterm Exam',
        type: 'exam',
        description: 'Comprehensive exam covering derivatives and integrals',
        total_points: 100,
        time_limit: 120,
        due_date: '2025-01-25T14:00:00',
        status: 'available',
        attempts_allowed: 1,
        attempts_used: 0
      },
      {
        id: 'assess-002',
        subject_id: 'subj-002',
        subject_name: 'Physics Laboratory',
        title: 'Motion and Forces Quiz',
        type: 'quiz',
        description: 'Quick assessment on Newton\'s laws',
        total_points: 50,
        time_limit: 30,
        due_date: '2025-01-22T16:00:00',
        status: 'graded',
        score: 45,
        grade: 'A-',
        feedback: 'Excellent understanding of concepts!',
        attempts_allowed: 2,
        attempts_used: 1
      },
      {
        id: 'assess-003',
        subject_id: 'subj-003',
        subject_name: 'English Literature',
        title: 'Shakespeare Analysis',
        type: 'assignment',
        description: 'Write a 1000-word analysis of Hamlet',
        total_points: 75,
        time_limit: 0,
        due_date: '2025-01-30T23:59:00',
        status: 'upcoming',
        attempts_allowed: 1,
        attempts_used: 0
      }
    ];

    // Sample fees
    const sampleFees: Fee[] = [
      {
        id: 'fee-001',
        description: 'Spring Semester Tuition',
        amount: 2500.00,
        due_date: '2025-02-01',
        status: 'pending',
        category: 'tuition'
      },
      {
        id: 'fee-002',
        description: 'Physics Lab Materials',
        amount: 150.00,
        due_date: '2025-01-15',
        status: 'paid',
        category: 'lab',
        paid_date: '2025-01-10',
        payment_method: 'Credit Card',
        receipt_number: 'REC-2025-001'
      },
      {
        id: 'fee-003',
        description: 'Mathematics Textbook',
        amount: 120.00,
        due_date: '2025-01-20',
        status: 'overdue',
        category: 'books'
      }
    ];

    // Sample announcements
    const sampleAnnouncements: Announcement[] = [
      {
        id: 'ann-001',
        title: 'Spring Semester Registration Open',
        content: 'Registration for Spring 2025 semester is now open. Please complete your course selection by January 31st.',
        author: 'Academic Office',
        date: '2025-01-15',
        category: 'academic',
        is_pinned: true,
        target_audience: ['students']
      },
      {
        id: 'ann-002',
        title: 'Science Fair 2025',
        content: 'Annual Science Fair will be held on March 15th. Registration deadline is February 20th. Prizes for top 3 projects!',
        author: 'Science Department',
        date: '2025-01-18',
        category: 'event',
        is_pinned: false,
        target_audience: ['students', 'parents']
      },
      {
        id: 'ann-003',
        title: 'Library Hours Extended',
        content: 'Library will now be open until 10 PM on weekdays to support exam preparation.',
        author: 'Library Staff',
        date: '2025-01-20',
        category: 'general',
        is_pinned: false,
        target_audience: ['students']
      }
    ];

    setStudent(sampleStudent);
    setSubjects(sampleSubjects);
    setAssessments(sampleAssessments);
    setFees(sampleFees);
    setAnnouncements(sampleAnnouncements);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'available': case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': case 'upcoming': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': case 'urgent': return 'text-red-600 bg-red-100';
      case 'submitted': case 'graded': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student dashboard...</p>
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
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {student?.first_name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{student?.student_id}</span>
              </div>
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
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'subjects', label: 'My Subjects', icon: BookOpen },
              { id: 'assessments', label: 'Assessments', icon: FileText },
              { id: 'fees', label: 'Fees & Payments', icon: DollarSign },
              { id: 'announcements', label: 'News & Events', icon: Bell }
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
            {/* Student Info Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{student?.first_name} {student?.last_name}</h2>
                  <p className="text-blue-100 mb-2">{student?.grade_level} - Section {student?.section}</p>
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <div>
                      <p className="text-blue-100 text-sm">GPA</p>
                      <p className="text-2xl font-bold">{student?.gpa}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Credits</p>
                      <p className="text-2xl font-bold">{student?.total_credits}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Enrolled Since</p>
                      <p className="text-lg font-semibold">{student?.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enrolled Subjects</p>
                    <p className="text-3xl font-bold text-gray-900">{subjects.filter(s => s.enrolled).length}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Assessments</p>
                    <p className="text-3xl font-bold text-gray-900">{assessments.filter(a => a.status === 'available' || a.status === 'upcoming').length}</p>
                  </div>
                  <FileText className="h-12 w-12 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding Fees</p>
                    <p className="text-3xl font-bold text-red-600">
                      ${fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0).toFixed(0)}
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Announcements</p>
                    <p className="text-3xl font-bold text-gray-900">{announcements.filter(a => new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
                  </div>
                  <Bell className="h-12 w-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upcoming Assessments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Assessments</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {assessments.filter(a => a.status === 'available' || a.status === 'upcoming').slice(0, 3).map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                          <p className="text-sm text-gray-600">{assessment.subject_name}</p>
                          <p className="text-sm text-gray-500">Due: {new Date(assessment.due_date).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.status)}`}>
                          {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Announcements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{announcement.content.substring(0, 100)}...</p>
                            <p className="text-xs text-gray-500 mt-2">{announcement.author} • {new Date(announcement.date).toLocaleDateString()}</p>
                          </div>
                          {announcement.is_pinned && (
                            <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Subjects</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.filter(s => s.enrolled).map((subject) => (
                <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-600">{subject.code}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subject.status)}`}>
                      {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{subject.teacher_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{subject.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{subject.room}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>{subject.credits} Credits</span>
                    </div>
                  </div>

                  {subject.grade && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Current Grade</span>
                        <span className="text-lg font-bold text-green-600">{subject.grade}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4">{subject.description}</p>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      View Details
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {subjects.filter(s => s.enrolled).length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects enrolled</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by enrolling in subjects</p>
              </div>
            )}
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Assessments</h2>
            </div>

            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.status)}`}>
                          {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          assessment.type === 'exam' ? 'bg-red-100 text-red-800' :
                          assessment.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{assessment.subject_name}</p>
                      <p className="text-gray-700 mb-4">{assessment.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Points:</span>
                          <span className="ml-1 font-medium">{assessment.total_points}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Time Limit:</span>
                          <span className="ml-1 font-medium">{assessment.time_limit ? `${assessment.time_limit} min` : 'No limit'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <span className="ml-1 font-medium">{new Date(assessment.due_date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Attempts:</span>
                          <span className="ml-1 font-medium">{assessment.attempts_used}/{assessment.attempts_allowed}</span>
                        </div>
                      </div>

                      {assessment.score !== undefined && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800">Your Score</span>
                            <span className="text-lg font-bold text-blue-600">
                              {assessment.score}/{assessment.total_points} ({assessment.grade})
                            </span>
                          </div>
                          {assessment.feedback && (
                            <p className="text-sm text-blue-700 mt-2">{assessment.feedback}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      {assessment.status === 'available' && assessment.attempts_used < assessment.attempts_allowed && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                          <Play className="h-4 w-4" />
                          <span>Start</span>
                        </button>
                      )}
                      
                      {assessment.status === 'graded' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>Review</span>
                        </button>
                      )}
                      
                      {assessment.status === 'upcoming' && (
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <Clock className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                          <span className="text-xs text-yellow-800">Not yet available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {assessments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
                <p className="text-gray-600">Check back later for new assessments from your teachers</p>
              </div>
            )}
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fees & Payments</h2>
            </div>

            {/* Fee Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                    <p className="text-3xl font-bold text-red-600">
                      ${fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Paid</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                    <p className="text-3xl font-bold text-orange-600">
                      ${fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Fee List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
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
                    {fees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{fee.description}</div>
                          {fee.receipt_number && (
                            <div className="text-sm text-gray-500">Receipt: {fee.receipt_number}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fee.category === 'tuition' ? 'bg-blue-100 text-blue-800' :
                            fee.category === 'books' ? 'bg-green-100 text-green-800' :
                            fee.category === 'lab' ? 'bg-purple-100 text-purple-800' :
                            fee.category === 'activity' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {fee.category.charAt(0).toUpperCase() + fee.category.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${fee.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(fee.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                            {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {fee.status === 'pending' && (
                              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1">
                                <CreditCard className="h-3 w-3" />
                                <span>Pay Now</span>
                              </button>
                            )}
                            {fee.status === 'paid' && (
                              <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1">
                                <Printer className="h-3 w-3" />
                                <span>Receipt</span>
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
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

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">News & Announcements</h2>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${
                  announcement.category === 'urgent' ? 'border-red-500' :
                  announcement.category === 'academic' ? 'border-blue-500' :
                  announcement.category === 'event' ? 'border-green-500' :
                  'border-gray-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        {announcement.is_pinned && (
                          <Star className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          announcement.category === 'urgent' ? 'bg-red-100 text-red-800' :
                          announcement.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                          announcement.category === 'event' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{announcement.content}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {announcement.author}</span>
                        <span>•</span>
                        <span>{new Date(announcement.date).toLocaleDateString()}</span>
                        {announcement.attachments && announcement.attachments.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>{announcement.attachments.length} attachment(s)</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {announcements.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-600">Check back later for updates from your school</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;