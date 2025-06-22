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
  CheckCircle
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

interface SchoolRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (schoolData: SchoolData) => void;
}

const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
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
    teacherCount: ''
  });

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

  const handleInputChange = (field: keyof SchoolData, value: string) => {
    setSchoolData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setSchoolData(prev => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(schoolData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return schoolData.schoolName && schoolData.address && schoolData.phone && schoolData.email;
      case 2:
        return schoolData.principalName && schoolData.principalEmail;
      case 3:
        return schoolData.plan;
      case 4:
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
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: School Information */}
          {currentStep === 1 && (
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
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
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
                    onChange={(e) => handleInputChange('address', e.target.value)}
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
                      onChange={(e) => handleInputChange('phone', e.target.value)}
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
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.yourschool.edu"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Principal Information & Logo */}
          {currentStep === 2 && (
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
                    onChange={(e) => handleInputChange('principalName', e.target.value)}
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
                    onChange={(e) => handleInputChange('principalEmail', e.target.value)}
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
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
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
                    onChange={(e) => handleInputChange('teacherCount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Plan Selection */}
          {currentStep === 3 && (
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
                    onClick={() => handleInputChange('plan', plan.id as any)}
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

          {/* Step 4: Review & Complete */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Complete</h3>
                <p className="text-gray-600">Confirm your school information and start your journey</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
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
                      <li>• Your school account will be created instantly</li>
                      <li>• You'll get access to demo accounts for testing</li>
                      <li>• Our team will help you set up your school data</li>
                      <li>• Start your 30-day free trial immediately</li>
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
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < 4 ? (
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
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>Complete Registration</span>
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;