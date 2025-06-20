import React, { useState, useEffect } from 'react';
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
  LogIn
} from 'lucide-react';
import AccountingDashboard from './components/AccountingDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import StudentDashboard from './components/StudentDashboard';
import TempAuthSelector from './components/TempAuthSelector';
import { useTempAuth } from './hooks/useTempAuth';

function App() {
  const { user, profile, loading, isAuthenticated, signIn, signOut } = useTempAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Redirect based on user role when authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      switch (profile.role) {
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
    } else {
      setCurrentView('landing');
    }
  }, [isAuthenticated, profile]);

  const handleUserSelect = async (userData: any) => {
    await signIn(userData);
    setShowAuthModal(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('landing');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Role-based dashboard routing
  if (isAuthenticated && profile) {
    switch (currentView) {
      case 'accounting':
        return <AccountingDashboard onSignOut={handleSignOut} />;
      case 'teacher':
        return <TeacherDashboard onSignOut={handleSignOut} />;
      case 'parent':
        return <ParentDashboard onSignOut={handleSignOut} />;
      case 'student':
        return <StudentDashboard onSignOut={handleSignOut} />;
      default:
        return <AccountingDashboard onSignOut={handleSignOut} />;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
              <button 
                onClick={() => setShowAuthModal(true)}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
              >
                <LogIn className="h-5 w-5" />
                <span>Demo Login</span>
              </button>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Demo
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
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold flex items-center justify-center space-x-2"
              >
                <span>Try Demo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Demo Mode Active
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Test all features without any setup! Click "Demo Login" to explore:
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
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-semibold"
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
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Try Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
              Schedule Demo
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
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">San Francisco, CA</span>
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

      {/* Auth Modal */}
      <TempAuthSelector
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSelectUser={handleUserSelect}
      />
    </div>
  );
}

export default App;