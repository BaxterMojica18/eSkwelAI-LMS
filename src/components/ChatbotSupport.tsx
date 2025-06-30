import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Navigation,
  Info,
  User,
  Calculator,
  GraduationCap,
  Users,
  BookOpen,
  Settings,
  Home,
  ArrowLeft,
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotSupportProps {
  currentUserRole?: string;
}

const ChatbotSupport: React.FC<ChatbotSupportProps> = ({ currentUserRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSection, setCurrentSection] = useState<'main' | 'faq' | 'navigation' | 'about'>('main');
  const [selectedNavRole, setSelectedNavRole] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m here to help you navigate eSkwelAI-LMS. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking 'Forgot Password' on the login page, or contact your system administrator for assistance."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to Settings > Profile to update your personal information, contact details, and preferences."
    },
    {
      question: "How do I contact technical support?",
      answer: "You can reach our support team at support@eskwelai-lms.com or call +1 (555) 123-4567 during business hours."
    },
    {
      question: "How do I export data from the system?",
      answer: "Most sections have an 'Export' button. You can export data as PDF, Excel, or CSV formats depending on the section."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use enterprise-grade encryption and are FERPA compliant. Your data is protected with bank-level security measures."
    },
    {
      question: "How do I change notification settings?",
      answer: "Go to Settings > Notifications to customize your email and SMS notification preferences."
    }
  ];

  const navigationData = {
    parent: {
      icon: Users,
      color: 'green',
      guides: [
        {
          title: "View Children's Progress",
          steps: [
            "Login to your Parent Portal",
            "Click on 'Overview' to see all your children",
            "Select a child to view detailed academic progress",
            "Check grades, attendance, and teacher feedback"
          ]
        },
        {
          title: "Check Fee Balances",
          steps: [
            "Go to 'Account Balances' tab",
            "View outstanding fees by child",
            "See payment breakdown by category",
            "Download payment receipts if needed"
          ]
        },
        {
          title: "Make Payments",
          steps: [
            "Navigate to 'Due Fees' section",
            "Select the fees you want to pay",
            "Click 'Pay Now' and enter payment details",
            "Receive confirmation and receipt"
          ]
        },
        {
          title: "View Payment History",
          steps: [
            "Go to 'Payment History' tab",
            "Use filters to search by date or child",
            "Download receipts for past payments",
            "Track payment status and methods"
          ]
        }
      ]
    },
    student: {
      icon: BookOpen,
      color: 'purple',
      guides: [
        {
          title: "Join a Class via QR Code",
          steps: [
            "Get QR code or enrollment link from your teacher",
            "Go to 'Join a Class' section",
            "Paste the QR code or scan with your phone",
            "Click 'Join Class' to enroll automatically"
          ]
        },
        {
          title: "Take Assessments",
          steps: [
            "Go to 'Assessments' tab",
            "Find available assessments",
            "Click 'Start' to begin the assessment",
            "Submit when completed and view results"
          ]
        },
        {
          title: "View Grades and Progress",
          steps: [
            "Check 'My Subjects' for current enrollments",
            "View grades and feedback from teachers",
            "Track your academic progress over time",
            "Download grade reports if needed"
          ]
        },
        {
          title: "Check Fee Status",
          steps: [
            "Go to 'Fees & Payments' section",
            "View outstanding and paid fees",
            "See payment due dates",
            "Contact parents for payment assistance"
          ]
        }
      ]
    },
    teacher: {
      icon: GraduationCap,
      color: 'blue',
      guides: [
        {
          title: "Create QR Enrollment Codes",
          steps: [
            "Go to 'Class Management' section",
            "Select your class or section",
            "Click 'Generate QR Code'",
            "Share the QR code with students for enrollment"
          ]
        },
        {
          title: "Create Assessments",
          steps: [
            "Navigate to 'Assessments' tab",
            "Click 'Create New Assessment'",
            "Add questions and set time limits",
            "Publish to make available to students"
          ]
        },
        {
          title: "Grade Student Work",
          steps: [
            "Go to 'Submitted Assessments'",
            "Review student submissions",
            "Assign grades and provide feedback",
            "Publish grades to students"
          ]
        },
        {
          title: "Manage Class Roster",
          steps: [
            "Access 'My Classes' section",
            "View enrolled students",
            "Add or remove students as needed",
            "Track attendance and participation"
          ]
        }
      ]
    },
    accounting: {
      icon: Calculator,
      color: 'red',
      guides: [
        {
          title: "Enroll New Students",
          steps: [
            "Go to 'Student Enrollment' section",
            "Click 'Add New Student'",
            "Fill in student and parent information",
            "Set up fee structure and payment plans"
          ]
        },
        {
          title: "Generate Financial Reports",
          steps: [
            "Navigate to 'Financial Reports'",
            "Select report type and date range",
            "Apply filters as needed",
            "Export or print the report"
          ]
        },
        {
          title: "Track Payments",
          steps: [
            "Go to 'Payment Tracking'",
            "View all student payments",
            "Filter by status, date, or student",
            "Send payment reminders to parents"
          ]
        },
        {
          title: "Manage Fee Structure",
          steps: [
            "Access 'Fee Management'",
            "Set up different fee categories",
            "Configure payment schedules",
            "Apply fees to student groups"
          ]
        }
      ]
    },
    admin: {
      icon: Settings,
      color: 'indigo',
      guides: [
        {
          title: "Manage School Settings",
          steps: [
            "Go to 'School Settings'",
            "Update school information",
            "Configure system preferences",
            "Set up academic calendar"
          ]
        },
        {
          title: "User Management",
          steps: [
            "Navigate to 'User Management'",
            "Add new users (teachers, staff)",
            "Assign roles and permissions",
            "Deactivate users when needed"
          ]
        },
        {
          title: "System Reports",
          steps: [
            "Access 'System Reports'",
            "View usage analytics",
            "Monitor system performance",
            "Export data for analysis"
          ]
        },
        {
          title: "Backup and Security",
          steps: [
            "Go to 'System Maintenance'",
            "Schedule regular backups",
            "Review security logs",
            "Update system settings"
          ]
        }
      ]
    }
  };

  const aboutData = [
    {
      title: "About eSkwelAI-LMS",
      content: "eSkwelAI-LMS is a comprehensive AI-powered Learning Management System designed specifically for small schools. We help educational institutions streamline operations, enhance learning outcomes, and foster growth through intelligent automation and data-driven insights."
    },
    {
      title: "Our Mission",
      content: "To democratize access to advanced educational technology for small schools, enabling them to provide world-class education management and learning experiences regardless of their size or budget."
    },
    {
      title: "Key Features",
      content: "• AI-powered analytics and insights\n• Comprehensive financial management\n• Student and teacher portals\n• Parent engagement tools\n• Assessment and grading systems\n• QR code enrollment\n• Real-time reporting\n• FERPA compliant security"
    },
    {
      title: "Support & Training",
      content: "We provide comprehensive onboarding, training materials, and 24/7 support to ensure your school gets the most out of our platform. Our team is dedicated to your success."
    },
    {
      title: "Contact Information",
      content: "📧 Email: support@eskwelai-lms.com\n📞 Phone: +1 (555) 123-4567\n🌐 Website: www.eskwelai-lms.com\n📍 Address: San Francisco, CA"
    }
  ];

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addMessage(inputMessage, 'user');
    
    // Simple response logic (can be enhanced with more sophisticated matching)
    const lowerInput = inputMessage.toLowerCase();
    let response = "I understand you're asking about that. For detailed help, please check our FAQ section or use the Navigation guide for your role. If you need immediate assistance, contact support at support@eskwelai-lms.com";

    if (lowerInput.includes('password') || lowerInput.includes('login')) {
      response = "For password issues, click 'Forgot Password' on the login page or contact your administrator. You can also check our FAQ section for more details.";
    } else if (lowerInput.includes('payment') || lowerInput.includes('fee')) {
      response = "For payment-related questions, parents can check the 'Account Balances' section. Students can view fees in 'Fees & Payments'. Need help navigating? Use our Navigation guide!";
    } else if (lowerInput.includes('grade') || lowerInput.includes('assessment')) {
      response = "Students can view grades in 'My Subjects' and take assessments in the 'Assessments' tab. Teachers can create and grade assessments in their dashboard. Check our Navigation guide for step-by-step instructions!";
    } else if (lowerInput.includes('enroll') || lowerInput.includes('qr')) {
      response = "Students can join classes using QR codes in the 'Join a Class' section. Teachers can generate QR codes in 'Class Management'. See our Navigation guide for detailed steps!";
    }

    setTimeout(() => {
      addMessage(response, 'bot');
    }, 1000);

    setInputMessage('');
  };

  const handleQuickAction = (action: string) => {
    addMessage(action, 'user');
    
    let response = "";
    switch (action) {
      case "How do I reset my password?":
        response = "To reset your password:\n1. Go to the login page\n2. Click 'Forgot Password'\n3. Enter your email address\n4. Check your email for reset instructions\n5. Follow the link to create a new password";
        break;
      case "How do I contact support?":
        response = "You can contact our support team:\n📧 Email: support@eskwelai-lms.com\n📞 Phone: +1 (555) 123-4567\n⏰ Hours: Monday-Friday, 9 AM - 6 PM EST\n\nFor urgent issues, please call our support line.";
        break;
      case "How do I export data?":
        response = "To export data:\n1. Navigate to the section with data you want to export\n2. Look for the 'Export' or 'Download' button\n3. Choose your preferred format (PDF, Excel, CSV)\n4. Click to download the file\n\nMost reports and lists have export functionality.";
        break;
      default:
        response = "Thanks for your question! Please check our FAQ section or use the Navigation guide for detailed help with specific tasks.";
    }

    setTimeout(() => {
      addMessage(response, 'bot');
    }, 1000);
  };

  const renderMainMenu = () => (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <Bot className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <h3 className="font-semibold text-gray-900">How can I help you?</h3>
        <p className="text-sm text-gray-600">Choose a category below</p>
      </div>
      
      <button
        onClick={() => setCurrentSection('faq')}
        className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
      >
        <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900">Frequently Asked Questions</div>
          <div className="text-sm text-gray-600">Common questions and answers</div>
        </div>
      </button>

      <button
        onClick={() => setCurrentSection('navigation')}
        className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
      >
        <Navigation className="h-6 w-6 text-green-600 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900">Navigation Help</div>
          <div className="text-sm text-gray-600">Step-by-step guides by role</div>
        </div>
      </button>

      <button
        onClick={() => setCurrentSection('about')}
        className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
      >
        <Info className="h-6 w-6 text-purple-600 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900">About eSkwelAI-LMS</div>
          <div className="text-sm text-gray-600">Learn more about our platform</div>
        </div>
      </button>

      <div className="border-t pt-3 mt-4">
        <p className="text-xs text-gray-500 mb-3">Quick Actions:</p>
        <div className="space-y-2">
          <button
            onClick={() => handleQuickAction("How do I reset my password?")}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded break-words"
          >
            Reset Password Help
          </button>
          <button
            onClick={() => handleQuickAction("How do I contact support?")}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded break-words"
          >
            Contact Support
          </button>
          <button
            onClick={() => handleQuickAction("How do I export data?")}
            className="w-full text-left text-sm text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded break-words"
          >
            Export Data Help
          </button>
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setCurrentSection('main')}
          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900 truncate">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => {
                addMessage(faq.question, 'user');
                setTimeout(() => addMessage(faq.answer, 'bot'), 500);
              }}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm break-words">{faq.question}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => {
            setCurrentSection('main');
            setSelectedNavRole(null);
          }}
          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Navigation className="h-5 w-5 text-green-600 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900 truncate">Navigation Help</h3>
      </div>

      {!selectedNavRole ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Select your role for specific guidance:</p>
          {Object.entries(navigationData).map(([role, data]) => {
            const IconComponent = data.icon;
            return (
              <button
                key={role}
                onClick={() => setSelectedNavRole(role)}
                className={`w-full flex items-center space-x-3 p-4 bg-${data.color}-50 hover:bg-${data.color}-100 rounded-lg transition-colors text-left`}
              >
                <IconComponent className={`h-6 w-6 text-${data.color}-600 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 capitalize">{role}</div>
                  <div className="text-sm text-gray-600">{data.guides.length} guides available</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedNavRole(null)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            <span>Back to roles</span>
          </button>
          
          <div className="space-y-3">
            {navigationData[selectedNavRole as keyof typeof navigationData].guides.map((guide, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => {
                    const steps = guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
                    addMessage(`How do I ${guide.title.toLowerCase()}?`, 'user');
                    setTimeout(() => addMessage(`Here's how to ${guide.title.toLowerCase()}:\n\n${steps}`, 'bot'), 500);
                  }}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm break-words">{guide.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{guide.steps.length} steps</div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setCurrentSection('main')}
          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Info className="h-5 w-5 text-purple-600 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900 truncate">About eSkwelAI-LMS</h3>
      </div>

      <div className="space-y-3">
        {aboutData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => {
                addMessage(`Tell me about: ${item.title}`, 'user');
                setTimeout(() => addMessage(item.content, 'bot'), 500);
              }}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm break-words">{item.title}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg break-words ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 z-50"
        title="Open Support Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="bg-white bg-opacity-20 p-2 rounded-full flex-shrink-0">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate">eSkwelAI Support</h3>
            {!isMinimized && <p className="text-xs text-blue-100 truncate">We're here to help!</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="h-[calc(100%-4rem)] overflow-hidden">
          {currentSection === 'main' && (
            <div className="p-4 h-full overflow-y-auto">
              {renderMainMenu()}
            </div>
          )}
          
          {currentSection === 'faq' && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b overflow-y-auto flex-shrink-0 max-h-[300px]">
                {renderFAQ()}
              </div>
              <div className="flex-1 min-h-0">
                {renderChatInterface()}
              </div>
            </div>
          )}
          
          {currentSection === 'navigation' && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b overflow-y-auto flex-shrink-0 max-h-[300px]">
                {renderNavigation()}
              </div>
              <div className="flex-1 min-h-0">
                {renderChatInterface()}
              </div>
            </div>
          )}
          
          {currentSection === 'about' && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b overflow-y-auto flex-shrink-0 max-h-[300px]">
                {renderAbout()}
              </div>
              <div className="flex-1 min-h-0">
                {renderChatInterface()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotSupport;