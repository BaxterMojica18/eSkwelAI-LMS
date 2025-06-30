import React from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  UserCheck,
  Home,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  LogIn,
  School,
  UserPlus
} from 'lucide-react';
import AccountingDashboard from './components/dashboards/AccountingDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import DeveloperDashboard from './components/dashboards/DeveloperDashboard';
import TempAuthSelector from './components/TempAuthSelector';
import SchoolRegistration from './components/SchoolRegistration';
import { UserRegistration } from './components/UserRegistration';
import SchoolDashboard from './components/SchoolDashboard';
import ChatbotSupport from './components/ChatbotSupport';
import DevTools from './components/DevTools';
import LoadingSpinner from './components/ui/LoadingSpinner';
import AuthModal from './components/ui/AuthModal';
import DemoRoleSelector from './components/DemoRoleSelector';
import { useAuth } from './hooks/useAuth';

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

function App() {
  const { user, profile, loading, isAuthenticated, createSchool, signOut } = useAuth();
  const [currentView, setCurrentView] = React.useState('landing');
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showSchoolRegistration, setShowSchoolRegistration] = React.useState(false);
  const [showUserRegistration, setShowUserRegistration] = React.useState(false);
  const [showDemoRoleSelector, setShowDemoRoleSelector] = React.useState(false);
  const [schoolData, setSchoolData] = React.useState<SchoolData | null>(null);
  const [isSchoolOwner, setIsSchoolOwner] = React.useState(false);
  const [authModalMode, setAuthModalMode] = React.useState<'signin' | 'signup'>('signin');
  const [authModalRole, setAuthModalRole] = React.useState('student');
  const [demoUser, setDemoUser] = React.useState<DemoUser | null>(null);

  // Redirect based on user role when authenticated
  React.useEffect(() => {
    if (isAuthenticated && profile) {
      console.log('User authenticated, profile:', profile);
      
      if (isSchoolOwner) {
        setCurrentView('school-owner');
      } else {
        // Route to appropriate dashboard based on role
        switch (profile.role) {
          case 'developer':
          case 'admin':
            setCurrentView('developer');
            break;
          case 'accounting':
            setCurrentView('accounting');
            break;
          case 'teacher':
            setCurrentView('teacher');
            break;
          case 'parent':
            setCurrentView('parent');
            break;
          case 'student':
            setCurrentView('student');
            break;
          default:
            console.warn('Unknown role:', profile.role);
            setCurrentView('landing');
        }
      }
    } else if (!loading) {
      setCurrentView('landing');
    }
  }, [isAuthenticated, profile, isSchoolOwner, loading]);

  const handleUserSelect = async (userData: any) => {
    // This is for demo login - we'll implement this later if needed
    setShowAuthModal(false);
  };

  const handleDemoRoleSelect = (selectedUser: DemoUser) => {
    console.log('Demo role selected:', selectedUser);
    setDemoUser(selectedUser);
    
    // Set the current view based on the selected role
    switch (selectedUser.role) {
      case 'accounting':
        setCurrentView('accounting');
        break;
      case 'teacher':
        setCurrentView('teacher');
        break;
      case 'parent':
        setCurrentView('parent');
        break;
      case 'student':
        setCurrentView('student');
        break;
      default:
        setCurrentView('landing');
    }
  };

  const handleSignOut = async () => {
    console.log('Signing out...');
    await signOut();
    setIsSchoolOwner(false);
    setSchoolData(null);
    setDemoUser(null);
    setCurrentView('landing');
  };

  const handleSchoolRegistrationComplete = async (data: SchoolData) => {
    try {
      // Create the school in the database
      const { school, error } = await createSchool({
        name: data.schoolName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        principalName: data.principalName,
        principalEmail: data.principalEmail,
        logoUrl: data.logoUrl,
        plan: data.plan,
        studentCount: data.studentCount,
        teacherCount: data.teacherCount
      });

      if (error) {
        console.error('Error creating school:', error);
        return;
      }

      if (school) {
        const completeSchoolData = {
          ...data,
          schoolCode: school.school_code
        };
        
        setSchoolData(completeSchoolData);
        setShowSchoolRegistration(false);
        setIsSchoolOwner(true);
        setCurrentView('school-owner');
      }
    } catch (error) {
      console.error('Error in school registration:', error);
    }
  };

  const handleUserRegistrationSuccess = (userData: any) => {
    console.log('User registration successful:', userData);
    setShowUserRegistration(false);
    // The useEffect will handle routing to the appropriate dashboard
    // based on the user's role once they're authenticated
  };

  const handleSchoolOwnerAccess = () => {
    // Simulate school owner login
    setIsSchoolOwner(true);
    setCurrentView('school-owner');
    // Use existing school data or create default
    if (!schoolData) {
      setSchoolData({
        schoolName: 'Demo Elementary School',
        address: '123 Education Street, Learning City, LC 12345',
        phone: '+1 (555) 123-4567',
        email: 'admin@demoschool.edu',
        website: 'https://www.demoschool.edu',
        principalName: 'Dr. Jane Smith',
        principalEmail: 'principal@demoschool.edu',
        logoUrl: '',
        plan: 'medium',
        studentCount: '750',
        teacherCount: '45',
        schoolCode: 'DEM1234'
      });
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // The useEffect will handle routing based on the authenticated user's role
  };

  const handleRegisterSchoolClick = () => {
    // Only show school registration if user is authenticated
    if (isAuthenticated) {
      setShowSchoolRegistration(true);
    } else {
      // If not authenticated, show sign in modal first
      setAuthModalMode('signin');
      setShowAuthModal(true);
    }
  };

  // Get role-specific dashboard button info
  const getDashboardButtonInfo = () => {
    // For demo users
    if (demoUser) {
      const roleName = demoUser.role === 'accounting' ? 'Admin' : 
                     demoUser.role.charAt(0).toUpperCase() + demoUser.role.slice(1);
      return {
        label: `${roleName} Dashboard`,
        onClick: () => {
          // Already in the dashboard, do nothing or show a menu
        }
      };
    }

    // For authenticated users
    if (isAuthenticated && profile) {
      let roleName = '';
      switch (profile.role) {
        case 'developer':
        case 'admin':
          roleName = 'Admin';
          break;
        case 'accounting':
          roleName = 'Admin';
          break;
        case 'teacher':
          roleName = 'Teacher';
          break;
        case 'parent':
          roleName = 'Parent';
          break;
        case 'student':
          roleName = 'Student';
          break;
        default:
          roleName = 'User';
      }
      
      return {
        label: `${roleName} Dashboard`,
        onClick: () => {
          // Navigate to the user's dashboard based on their role
          switch (profile.role) {
            case 'developer':
            case 'admin':
              setCurrentView('developer');
              break;
            case 'accounting':
              setCurrentView('accounting');
              break;
            case 'teacher':
              setCurrentView('teacher');
              break;
            case 'parent':
              setCurrentView('parent');
              break;
            case 'student':
              setCurrentView('student');
              break;
          }
        }
      };
    }

    // Default for non-authenticated users
    return {
      label: 'School Dashboard',
      onClick: handleSchoolOwnerAccess
    };
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <>
        <LoadingSpinner />
        <ChatbotSupport />
        <DevTools />
      </>
    );
  }

  // Demo role dashboards (when a demo user is selected)
  if (demoUser) {
    const dashboardProps = { 
      onSignOut: handleSignOut,
      demoUser: demoUser // Pass demo user data to show personalized name
    };

    switch (demoUser.role) {
      case 'accounting':
        return (
          <>
            <AccountingDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="accounting" />
            <DevTools />
          </>
        );
      case 'teacher':
        return (
          <>
            <TeacherDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="teacher" />
            <DevTools />
          </>
        );
      case 'parent':
        return (
          <>
            <ParentDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="parent" />
            <DevTools />
          </>
        );
      case 'student':
        return (
          <>
            <StudentDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="student" />
            <DevTools />
          </>
        );
    }
  }

  // School Owner Dashboard
  if (isSchoolOwner && schoolData) {
    return (
      <>
        <SchoolDashboard schoolData={schoolData} onSignOut={handleSignOut} />
        <ChatbotSupport currentUserRole="admin" />
        <DevTools />
      </>
    );
  }

  // Role-based dashboard routing
  if (isAuthenticated && profile) {
    const dashboardProps = { 
      onSignOut: handleSignOut,
      userProfile: profile // Pass real user profile for personalized name
    };

    switch (currentView) {
      case 'developer':
        return (
          <>
            <DeveloperDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="developer" />
            <DevTools />
          </>
        );
      case 'accounting':
        return (
          <>
            <AccountingDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="accounting" />
            <DevTools />
          </>
        );
      case 'teacher':
        return (
          <>
            <TeacherDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="teacher" />
            <DevTools />
          </>
        );
      case 'parent':
        return (
          <>
            <ParentDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="parent" />
            <DevTools />
          </>
        );
      case 'student':
        return (
          <>
            <StudentDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="student" />
            <DevTools />
          </>
        );
      default:
        // Fallback to accounting dashboard for unknown roles
        return (
          <>
            <AccountingDashboard {...dashboardProps} />
            <ChatbotSupport currentUserRole="accounting" />
            <DevTools />
          </>
        );
    }
  }

  const features = [
    {
      icon: Calculator,
      title: "School Accounting",
      description: "Comprehensive financial management with automated budgeting, expense tracking, and detailed financial reporting powered by AI insights."
    },
    {
      icon: TrendingUp,
      title: "School Development",
      description: "Strategic planning tools, curriculum development, and institutional growth tracking with data-driven recommendations."
    },
    {
      icon: GraduationCap,
      title: "Students",
      description: "Student information systems, grade management, attendance tracking, and personalized learning analytics."
    },
    {
      icon: Users,
      title: "Teachers",
      description: "Teacher management, professional development tracking, performance analytics, and resource allocation tools."
    },
    {
      icon: Home,
      title: "Parents",
      description: "Parent portal with real-time updates, communication tools, and student progress monitoring capabilities."
    }
  ];

  const plans = [
    {
      name: "Small",
      description: "Perfect for elementary schools and small institutions",
      features: [
        "500 Students",
        "50 Teachers", 
        "50 Faculty Members",
        "5 Developers",
        "500 Parents"
      ],
      highlight: false
    },
    {
      name: "Medium",
      description: "Ideal for growing schools and medium-sized institutions",
      features: [
        "1,000 Students",
        "100 Teachers",
        "100 Faculty Members", 
        "15 Developers",
        "1,000 Parents"
      ],
      highlight: true
    },
    {
      name: "Large",
      description: "Enterprise solution for large schools and districts",
      features: [
        "5,000+ Students",
        "500+ Teachers",
        "500+ Faculty Members",
        "100 Developers", 
        "5,000+ Parents"
      ],
      highlight: false
    }
  ];

  const dashboardButtonInfo = getDashboardButtonInfo();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">eSkwelAI-LMS</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              {/* Authentication Section - Sign In & Sign Up */}
              {!isAuthenticated && !demoUser ? (
                <>
                  <button 
                    onClick={() => {
                      setAuthModalMode('signin');
                      setShowAuthModal(true);
                    }}
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                  <button 
                    onClick={() => {
                      setAuthModalMode('signup');
                      setAuthModalRole('student');
                      setShowAuthModal(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Authenticated User Actions */}
                  <span className="text-gray-600 text-sm">
                    Welcome, {demoUser ? demoUser.first_name : profile?.first_name}!
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              )}
              
              {/* School Actions Section */}
              <button 
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalRole('student');
                  setShowUserRegistration(true);
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Join School</span>
              </button>
              
              {/* Show Register School button only when authenticated */}
              {isAuthenticated && (
                <button 
                  onClick={handleRegisterSchoolClick}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <School className="h-5 w-5" />
                  <span>Register School</span>
                </button>
              )}
              
              {/* Dynamic Dashboard Button */}
              <button 
                onClick={dashboardButtonInfo.onClick}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Building className="h-5 w-5" />
                <span>{dashboardButtonInfo.label}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>AI-Powered LMS Solution</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your School with 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> AI-Driven</span> LMS
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              eSkwelAI-LMS empowers small schools with comprehensive learning management solutions. 
              Streamline operations, enhance education, and foster growth with our intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && !demoUser ? (
                <>
                  <button 
                    onClick={() => {
                      setAuthModalMode('signup');
                      setAuthModalRole('admin');
                      setShowAuthModal(true);
                    }}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                  >
                    <School className="h-5 w-5" />
                    <span>Get Started - Register School</span>
                  </button>
                  <button 
                    onClick={() => {
                      setAuthModalMode('signup');
                      setAuthModalRole('student');
                      setShowUserRegistration(true);
                    }}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Join a School</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleRegisterSchoolClick}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                  >
                    <School className="h-5 w-5" />
                    <span>Register Your School</span>
                  </button>
                  <button 
                    onClick={() => setShowUserRegistration(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Join a School</span>
                  </button>
                </>
              )}
              <button 
                onClick={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Types Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Two Ways to Get Started
            </h2>
            <p className="text-lg text-gray-600">
              Choose the registration type that fits your role
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* School Registration */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-200">
              <div className="text-center mb-6">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <School className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🏫 School Registration
                </h3>
                <p className="text-gray-600">
                  For school administrators and owners
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Create your school's account</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Get a unique school code</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Manage all school users</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Access admin dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">30-day free trial</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    handleRegisterSchoolClick();
                  } else {
                    setAuthModalMode('signup');
                    setAuthModalRole('admin');
                    setShowAuthModal(true);
                  }
                }}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <School className="h-5 w-5" />
                <span>Register Your School</span>
              </button>
            </div>

            {/* User Registration */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
              <div className="text-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <UserPlus className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  👥 Join a School
                </h3>
                <p className="text-gray-600">
                  For teachers, students, and parents
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Enter your school's code</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Choose your role (Teacher/Student/Parent)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Automatically linked to school</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Access role-specific features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Free to join</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalRole('student');
                  setShowUserRegistration(true);
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Join a School</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => {
                  setAuthModalMode('signin');
                  setShowAuthModal(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Demo Mode Available
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Test all features without any setup! Click "Start Testing Now" to explore:
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Calculator className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-900">Accounting</h3>
                <p className="text-sm text-red-700">Financial reports & student enrollment</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Teacher</h3>
                <p className="text-sm text-blue-700">Class management & assessments</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Parent</h3>
                <p className="text-sm text-green-700">Children's balances & payments</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Student</h3>
                <p className="text-sm text-purple-700">Enrollment & assessments</p>
              </div>
            </div>
            <div className="mt-6">
              <button 
                onClick={() => setShowDemoRoleSelector(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
              >
                Start Testing Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete LMS Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform covers every aspect of school management, 
              from financial planning to student success tracking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Brain className="h-6 w-6" />
                <span className="font-semibold">AI-Powered Intelligence</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Smart Analytics for Smarter Decisions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI engine analyzes patterns, predicts trends, and provides actionable insights 
                to help your school make data-driven decisions for better educational outcomes.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Predictive student performance analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Automated financial forecasting and budgeting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Intelligent resource allocation recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Real-time risk assessment and alerts</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Dashboard Preview</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Student Performance Trend</span>
                    <span className="text-sm text-blue-600">↗ +12%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Budget Optimization</span>
                    <span className="text-sm text-green-600">↗ +8%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Teacher Efficiency</span>
                    <span className="text-sm text-purple-600">↗ +15%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '82%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to grow with your school. 
              All plans include full access to our AI-powered features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl border-2 p-8 ${
                plan.highlight 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              } transition-all hover:shadow-lg`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlight ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    Contact Sales
                  </div>
                  <p className="text-gray-500 text-sm">Custom pricing for your needs</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className={`h-5 w-5 ${
                        plan.highlight ? 'text-blue-500' : 'text-green-500'
                      }`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Contact Sales
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your school's data is protected with bank-level security measures, 
              ensuring complete privacy and compliance with educational regulations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Encryption</h3>
              <p className="text-gray-600">End-to-end encryption for all sensitive information</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">FERPA Compliant</h3>
              <p className="text-gray-600">Full compliance with educational privacy laws</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">Reliable service with guaranteed availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using eSkwelAI-LMS to enhance their educational experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  handleRegisterSchoolClick();
                } else {
                  setAuthModalMode('signup');
                  setAuthModalRole('admin');
                  setShowAuthModal(true);
                }
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <School className="h-5 w-5" />
              <span>Register Your School</span>
            </button>
            <button 
              onClick={() => {
                setAuthModalMode('signup');
                setAuthModalRole('student');
                setShowUserRegistration(true);
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Join a School</span>
            </button>
            <button 
              onClick={() => {
                setAuthModalMode('signin');
                setShowAuthModal(true);
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">eSkwelAI-LMS</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering small schools with AI-driven learning management solutions 
                for better educational outcomes and operational efficiency.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">contact@eskwelai-lms.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">+63 0993 869 4007</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Philippines</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Security</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Integrations</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Training</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-12 text-center">
            <p className="text-gray-400">
              © 2025 eSkwelAI-LMS. All rights reserved. Built with ❤️ for education.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialRole={authModalRole}
      />

      <SchoolRegistration
        isOpen={showSchoolRegistration}
        onClose={() => setShowSchoolRegistration(false)}
        onComplete={handleSchoolRegistrationComplete}
      />

      <UserRegistration
        isOpen={showUserRegistration}
        onClose={() => setShowUserRegistration(false)}
        onSuccess={handleUserRegistrationSuccess}
      />

      <DemoRoleSelector
        isOpen={showDemoRoleSelector}
        onClose={() => setShowDemoRoleSelector(false)}
        onSelectRole={handleDemoRoleSelect}
      />

      {/* Chatbot Support - Always visible on landing page */}
      <ChatbotSupport />
      
      {/* DevTools - Always visible */}
      <DevTools />
    </div>
  );
}

export default App;