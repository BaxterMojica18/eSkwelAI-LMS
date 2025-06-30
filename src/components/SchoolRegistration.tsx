import React, { useState } from 'react';
import {
  Building,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Users,
  GraduationCap,
  Calculator,
  BookOpen,
  Crown,
  Star,
  Zap,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  FileText,
  CreditCard,
  CheckCircle,
  Copy,
  Key,
  User,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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

interface SchoolRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (schoolData: SchoolData) => void;
}

const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({ isOpen, onClose, onComplete }) => {
  const { signUp, createSchool, loading, isAuthenticated } = useAuth();
  
  // Start at step 1 (school info) if authenticated, step 1 (account creation) if not
  const [currentStep, setCurrentStep] = useState(isAuthenticated ? 1 : 1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Account creation data (only needed if not authenticated)
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // School data
  const [schoolData, setSchoolData] = useState<SchoolData>({
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    principalName: '',
    principalEmail: '',
    logoUrl: '',
    plan: 'medium',
    studentCount: '',
    teacherCount: '',
    schoolCode: ''
  });

  // Calculate total steps and current step based on authentication status
  const totalSteps = isAuthenticated ? 5 : 6;
  const stepOffset = isAuthenticated ? 0 : 1; // Skip account creation if authenticated

  const generateSchoolCode = () => {
    const prefix = schoolData.schoolName
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  const plans = [
    {
      id: 'small',
      name: 'Small School',
      description: 'Perfect for elementary schools and small institutions',
      price: '$99/month',
      features: [
        '500 Students',
        '50 Teachers',
        '50 Faculty Members',
        '5 Administrators',
        '500 Parents',
        'Basic Analytics',
        'Email Support',
        'Standard Features'
      ],
      icon: Building,
      color: 'blue',
      popular: false
    },
    {
      id: 'medium',
      name: 'Medium School',
      description: 'Ideal for growing schools and medium-sized institutions',
      price: '$199/month',
      features: [
        '1,000 Students',
        '100 Teachers',
        '100 Faculty Members',
        '15 Administrators',
        '1,000 Parents',
        'Advanced Analytics',
        'Priority Support',
        'All Features',
        'Custom Reports'
      ],
      icon: GraduationCap,
      color: 'green',
      popular: true
    },
    {
      id: 'large',
      name: 'Large School',
      description: 'Enterprise solution for large schools and districts',
      price: '$399/month',
      features: [
        '5,000+ Students',
        '500+ Teachers',
        '500+ Faculty Members',
        '100 Administrators',
        '5,000+ Parents',
        'Enterprise Analytics',
        '24/7 Phone Support',
        'All Features',
        'Custom Integrations',
        'Dedicated Account Manager'
      ],
      icon: Crown,
      color: 'purple',
      popular: false
    }
  ];

  const handleAccountInputChange = (field: keyof typeof accountData, value: string) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSchoolInputChange = (field: keyof SchoolData, value: string) => {
    setSchoolData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSchoolData(prev => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Generate school code when moving to the school code step
      const schoolCodeStep = isAuthenticated ? 4 : 5;
      if (currentStep === schoolCodeStep - 1 && !schoolData.schoolCode) {
        const code = generateSchoolCode();
        setSchoolData(prev => ({ ...prev, schoolCode: code }));
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAccount = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!accountData.firstName || !accountData.lastName || !accountData.email || !accountData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (accountData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { user, error } = await signUp(accountData.email, accountData.password, {
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        role: 'admin', // School owners get admin role
        phone: accountData.phone
      });

      if (error) {
        setError(error);
        return;
      }

      if (user) {
        setSuccess('Account created successfully! Now let\'s set up your school.');
        setTimeout(() => {
          setSuccess(null);
          nextStep(); // Move to school information step
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    }
  };

  const handleComplete = async () => {
    setError(null);
    
    try {
      const { school, error } = await createSchool({
        name: schoolData.schoolName,
        address: schoolData.address,
        phone: schoolData.phone,
        email: schoolData.email,
        website: schoolData.website,
        principalName: schoolData.principalName,
        principalEmail: schoolData.principalEmail,
        logoUrl: schoolData.logoUrl,
        plan: schoolData.plan,
        studentCount: schoolData.studentCount,
        teacherCount: schoolData.teacherCount
      });

      if (error) {
        setError(error);
        return;
      }

      if (school) {
        const completeSchoolData = {
          ...schoolData,
          schoolCode: school.school_code
        };
        onComplete(completeSchoolData);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create school');
    }
  };

  const copySchoolCode = () => {
    navigator.clipboard.writeText(schoolData.schoolCode);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        if (!isAuthenticated) {
          return accountData.firstName && accountData.lastName && accountData.email && accountData.password && accountData.confirmPassword;
        } else {
          return schoolData.schoolName && schoolData.address && schoolData.phone && schoolData.email;
        }
      case 2:
        if (!isAuthenticated) {
          return schoolData.schoolName && schoolData.address && schoolData.phone && schoolData.email;
        } else {
          return schoolData.principalName && schoolData.principalEmail;
        }
      case 3:
        if (!isAuthenticated) {
          return schoolData.principalName && schoolData.principalEmail;
        } else {
          return schoolData.plan;
        }
      case 4:
        if (!isAuthenticated) {
          return schoolData.plan;
        } else {
          return schoolData.schoolCode;
        }
      case 5:
        if (!isAuthenticated) {
          return schoolData.schoolCode;
        } else {
          return true;
        }
      case 6:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Register Your School</h2>
                <p className="text-gray-600">Set up your institution on eSkwelAI-LMS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Step 1: Create Account (only if not authenticated) */}
          {currentStep === 1 && !isAuthenticated && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h3>
                <p className="text-gray-600">First, let's create your school owner account</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={accountData.firstName}
                      onChange={(e) => handleAccountInputChange('firstName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={accountData.lastName}
                      onChange={(e) => handleAccountInputChange('lastName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={accountData.email}
                      onChange={(e) => handleAccountInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={accountData.phone}
                      onChange={(e) => handleAccountInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={accountData.password}
                      onChange={(e) => handleAccountInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={accountData.confirmPassword}
                      onChange={(e) => handleAccountInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Crown className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">School Owner Account</h4>
                    <p className="text-blue-800 text-sm">
                      This account will have administrative privileges to manage your school, 
                      including user management, settings, and billing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* School Information Step */}
          {((currentStep === 1 && isAuthenticated) || (currentStep === 2 && !isAuthenticated)) && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">School Information</h3>
                <p className="text-gray-600">Tell us about your educational institution</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolData.schoolName}
                    onChange={(e) => handleSchoolInputChange('schoolName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your school name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Address *
                  </label>
                  <textarea
                    required
                    value={schoolData.address}
                    onChange={(e) => handleSchoolInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter complete school address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={schoolData.phone}
                      onChange={(e) => handleSchoolInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={schoolData.email}
                      onChange={(e) => handleSchoolInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="school@example.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={schoolData.website}
                      onChange={(e) => handleSchoolInputChange('website', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.yourschool.edu"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Principal Information & Logo Step */}
          {((currentStep === 2 && isAuthenticated) || (currentStep === 3 && !isAuthenticated)) && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Principal Information</h3>
                <p className="text-gray-600">Add principal details and school logo</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolData.principalName}
                    onChange={(e) => handleSchoolInputChange('principalName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={schoolData.principalEmail}
                    onChange={(e) => handleSchoolInputChange('principalEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="principal@school.edu"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Logo (Optional)
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {schoolData.logoUrl ? (
                        <img
                          src={schoolData.logoUrl}
                          alt="School Logo"
                          className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Logo</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 2MB. Recommended: 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Student Count
                  </label>
                  <input
                    type="number"
                    value={schoolData.studentCount}
                    onChange={(e) => handleSchoolInputChange('studentCount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Teacher Count
                  </label>
                  <input
                    type="number"
                    value={schoolData.teacherCount}
                    onChange={(e) => handleSchoolInputChange('teacherCount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Plan Selection Step */}
          {((currentStep === 3 && isAuthenticated) || (currentStep === 4 && !isAuthenticated)) && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Star className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
                <p className="text-gray-600">Select the plan that best fits your school size</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleSchoolInputChange('plan', plan.id as any)}
                    className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                      schoolData.plan === plan.id
                        ? `border-${plan.color}-500 bg-${plan.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <plan.icon className={`h-12 w-12 mx-auto mb-3 text-${plan.color}-600`} />
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className={`h-4 w-4 text-${plan.color}-500`} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {schoolData.plan === plan.id && (
                      <div className="absolute top-4 right-4">
                        <div className={`bg-${plan.color}-500 text-white rounded-full p-1`}>
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">30-Day Free Trial</h4>
                    <p className="text-blue-800 text-sm">
                      Start with a free trial. No credit card required. Cancel anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* School Code Generation Step */}
          {((currentStep === 4 && isAuthenticated) || (currentStep === 5 && !isAuthenticated)) && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Key className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your School Code</h3>
                <p className="text-gray-600">This unique code will be used by teachers, students, and parents to join your school</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border-2 border-blue-200">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">School Registration Code</h4>
                    <div className="bg-white rounded-lg p-6 border-2 border-dashed border-blue-300 mb-4">
                      <div className="text-4xl font-bold text-blue-600 tracking-wider font-mono">
                        {schoolData.schoolCode}
                      </div>
                    </div>
                    <button
                      onClick={copySchoolCode}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Code</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Key className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-yellow-900 mb-2">Important Instructions:</h5>
                      <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• Share this code with teachers, students, and parents</li>
                        <li>• They will enter this code during registration</li>
                        <li>• This automatically associates them with your school</li>
                        <li>• Keep this code secure and only share with authorized users</li>
                        <li>• You can regenerate this code later if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review & Complete Step */}
          {((currentStep === 5 && isAuthenticated) || (currentStep === 6 && !isAuthenticated)) && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Complete</h3>
                <p className="text-gray-600">Confirm your school information and start your journey</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Account Info (only if account was created) */}
                {!isAuthenticated && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Account Information</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{accountData.firstName} {accountData.lastName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{accountData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span>
                        <span className="ml-2 font-medium">School Owner</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{accountData.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* School Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>School Information</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{schoolData.schoolName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{schoolData.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{schoolData.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Principal:</span>
                      <span className="ml-2 font-medium">{schoolData.principalName}</span>
                    </div>
                  </div>
                </div>

                {/* School Code */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>School Code</span>
                  </h4>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 font-mono">{schoolData.schoolCode}</div>
                        <div className="text-sm text-gray-600">Registration code for new users</div>
                      </div>
                      <button
                        onClick={copySchoolCode}
                        className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Plan Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Selected Plan</span>
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="font-medium text-gray-900">
                        {plans.find(p => p.id === schoolData.plan)?.name}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {plans.find(p => p.id === schoolData.plan)?.price}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>✅ 30-day free trial</div>
                      <div>✅ No setup fees</div>
                      <div>✅ Cancel anytime</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">What happens next?</h4>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Your school will be created in the database</li>
                      <li>• You'll get access to the school dashboard</li>
                      <li>• Share your school code with teachers, students, and parents</li>
                      <li>• Start your 30-day free trial immediately</li>
                      <li>• Our team will help you set up your school data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i + 1}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === 1 && !isAuthenticated ? (
              <button
                onClick={handleCreateAccount}
                disabled={!isStepValid() || loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating School...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;