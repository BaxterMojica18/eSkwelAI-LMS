import React, { useState } from 'react';
import {
  Plus,
  BookOpen,
  FileText,
  ClipboardCheck,
  GraduationCap,
  Users,
  Upload,
  Youtube,
  Edit3,
  Trash2,
  ChevronLeft,
  Save,
  X,
  Move,
  CheckSquare,
  Type,
  List,
  MousePointer,
  MessageSquare,
  Send,
  Download,
  ExternalLink,
  Clock,
  Hash,
  Settings,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Section {
  id: string;
  name: string;
  number: number;
  students: Student[];
}

interface LearningModule {
  id: string;
  title: string;
  type: 'pdf' | 'video';
  content: string;
  description: string;
  fileName?: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'enumeration';
  question: string;
  options?: string[];
  correctAnswers: string[];
  points: number;
  allowMultiple?: boolean;
  blanks?: string[];
}

interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'exam' | 'assessment';
  questions: Question[];
  timeLimit?: number;
  totalPoints: number;
  instructions?: string;
}

interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  attachment?: {
    type: 'pdf' | 'youtube';
    content: string;
    fileName?: string;
  };
}

interface SchoolLevel {
  id: string;
  name: string;
  sections: Section[];
}

const TeacherDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'levels' | 'sections' | 'section-detail'>('levels');
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'quizzes' | 'assessments' | 'exams' | 'chat'>('modules');
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [contentType, setContentType] = useState<'module' | 'quiz' | 'assessment' | 'exam'>('module');
  const [uploadType, setUploadType] = useState<'pdf' | 'youtube'>('pdf');

  // Assessment Builder States
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Partial<Assessment>>({
    title: '',
    type: 'quiz',
    questions: [],
    timeLimit: undefined,
    totalPoints: 0,
    instructions: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    question: '',
    options: ['', ''],
    correctAnswers: [],
    points: 1,
    allowMultiple: false
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatAttachment, setChatAttachment] = useState<File | null>(null);
  const [chatYouTubeUrl, setChatYouTubeUrl] = useState('');
  const [chatAttachmentType, setChatAttachmentType] = useState<'none' | 'pdf' | 'youtube'>('none');

  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>([
    {
      id: '1',
      name: 'Elementary',
      sections: [
        {
          id: '1',
          name: 'Grade 1 - Section A',
          number: 1,
          students: []
        }
      ]
    },
    {
      id: '2',
      name: 'High School',
      sections: []
    },
    {
      id: '3',
      name: 'Senior High School',
      sections: []
    }
  ]);

  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [quizzes, setQuizzes] = useState<Assessment[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [exams, setExams] = useState<Assessment[]>([]);

  const [newSectionName, setNewSectionName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 0 and has 11 digits, replace 0 with +63
    if (digits.startsWith('0') && digits.length === 11) {
      return '+63' + digits.substring(1);
    }
    
    // If starts with 63 and has 12 digits, add +
    if (digits.startsWith('63') && digits.length === 12) {
      return '+' + digits;
    }
    
    // Return as is if already formatted or invalid
    return phone;
  };

  const addSection = () => {
    if (!selectedLevel || !newSectionName.trim()) return;

    const newSection: Section = {
      id: Date.now().toString(),
      name: newSectionName,
      number: selectedLevel.sections.length + 1,
      students: []
    };

    setSchoolLevels(levels =>
      levels.map(level =>
        level.id === selectedLevel.id
          ? { ...level, sections: [...level.sections, newSection] }
          : level
      )
    );

    // Update selectedLevel to reflect the change
    setSelectedLevel(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newSection]
    } : null);

    setNewSectionName('');
    setShowAddSection(false);
  };

  const addStudent = () => {
    if (!selectedSection || !newStudentName.trim() || !newStudentEmail.trim()) return;

    const formattedPhone = formatPhoneNumber(newStudentPhone);
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName,
      email: newStudentEmail,
      phone: formattedPhone
    };

    setSchoolLevels(levels =>
      levels.map(level =>
        level.id === selectedLevel?.id
          ? {
              ...level,
              sections: level.sections.map(section =>
                section.id === selectedSection.id
                  ? { ...section, students: [...section.students, newStudent] }
                  : section
              )
            }
          : level
      )
    );

    // Update selectedSection to reflect the change
    setSelectedSection(prev => prev ? {
      ...prev,
      students: [...prev.students, newStudent]
    } : null);

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setShowAddStudent(false);
  };

  const createContent = () => {
    if (contentType === 'module') {
      if (!moduleTitle.trim()) {
        alert('Please enter a module title');
        return;
      }

      if (uploadType === 'pdf' && !selectedFile) {
        alert('Please select a PDF file');
        return;
      }

      if (uploadType === 'youtube' && !youtubeUrl.trim()) {
        alert('Please enter a YouTube URL');
        return;
      }

      if (uploadType === 'youtube' && !youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        alert('Please enter a valid YouTube URL');
        return;
      }

      const newModule: LearningModule = {
        id: Date.now().toString(),
        title: moduleTitle,
        type: uploadType,
        content: uploadType === 'pdf' ? URL.createObjectURL(selectedFile!) : youtubeUrl,
        description: moduleDescription,
        fileName: uploadType === 'pdf' ? selectedFile?.name : undefined
      };

      setLearningModules(prev => [...prev, newModule]);

      // Reset form
      setModuleTitle('');
      setModuleDescription('');
      setSelectedFile(null);
      setYoutubeUrl('');
      setShowCreateContent(false);
    } else {
      // For assessments, open the assessment builder
      setCurrentAssessment({
        title: '',
        type: contentType,
        questions: [],
        timeLimit: contentType === 'exam' ? 60 : undefined,
        totalPoints: 0,
        instructions: ''
      });
      setShowCreateContent(false);
      setShowAssessmentBuilder(true);
    }
  };

  // Assessment Builder Functions
  const addQuestionToAssessment = () => {
    if (!currentQuestion.question?.trim()) {
      alert('Please enter a question');
      return;
    }

    // Validation based on question type
    if (currentQuestion.type === 'multiple-choice') {
      if (!currentQuestion.options?.some(opt => opt.trim())) {
        alert('Please add at least one option');
        return;
      }
      if (currentQuestion.correctAnswers?.length === 0) {
        alert('Please select at least one correct answer');
        return;
      }
    } else if (currentQuestion.type === 'fill-blank') {
      if (!currentQuestion.blanks?.some(blank => blank.trim())) {
        alert('Please add at least one correct answer for the blank');
        return;
      }
    } else if (currentQuestion.type === 'enumeration') {
      if (!currentQuestion.correctAnswers?.some(answer => answer.trim())) {
        alert('Please add at least one correct answer');
        return;
      }
    }

    const question: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type!,
      question: currentQuestion.question!,
      options: currentQuestion.options?.filter(opt => opt.trim()) || [],
      correctAnswers: currentQuestion.type === 'fill-blank' 
        ? currentQuestion.blanks?.filter(blank => blank.trim()) || []
        : currentQuestion.correctAnswers?.filter(answer => answer.trim()) || [],
      points: currentQuestion.points || 1,
      allowMultiple: currentQuestion.allowMultiple || false,
      blanks: currentQuestion.blanks?.filter(blank => blank.trim()) || []
    };

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...(currentAssessment.questions || [])];
      updatedQuestions[editingQuestionIndex] = question;
      setCurrentAssessment(prev => ({
        ...prev,
        questions: updatedQuestions,
        totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
      }));
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      const newQuestions = [...(currentAssessment.questions || []), question];
      setCurrentAssessment(prev => ({
        ...prev,
        questions: newQuestions,
        totalPoints: newQuestions.reduce((sum, q) => sum + q.points, 0)
      }));
    }

    // Reset question form
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', ''],
      correctAnswers: [],
      points: 1,
      allowMultiple: false,
      blanks: ['']
    });
    setShowQuestionBuilder(false);
  };

  const editQuestion = (index: number) => {
    const question = currentAssessment.questions![index];
    setCurrentQuestion({
      ...question,
      blanks: question.type === 'fill-blank' ? question.correctAnswers : ['']
    });
    setEditingQuestionIndex(index);
    setShowQuestionBuilder(true);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = currentAssessment.questions!.filter((_, i) => i !== index);
    setCurrentAssessment(prev => ({
      ...prev,
      questions: updatedQuestions,
      totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
    }));
  };

  const saveAssessment = () => {
    if (!currentAssessment.title?.trim()) {
      alert('Please enter an assessment title');
      return;
    }

    if (!currentAssessment.questions?.length) {
      alert('Please add at least one question');
      return;
    }

    const assessment: Assessment = {
      id: Date.now().toString(),
      title: currentAssessment.title!,
      type: currentAssessment.type!,
      questions: currentAssessment.questions!,
      timeLimit: currentAssessment.timeLimit,
      totalPoints: currentAssessment.totalPoints!,
      instructions: currentAssessment.instructions || ''
    };

    // Add to appropriate list
    if (assessment.type === 'quiz') {
      setQuizzes(prev => [...prev, assessment]);
    } else if (assessment.type === 'assessment') {
      setAssessments(prev => [...prev, assessment]);
    } else if (assessment.type === 'exam') {
      setExams(prev => [...prev, assessment]);
    }

    // Reset and close
    setCurrentAssessment({
      title: '',
      type: 'quiz',
      questions: [],
      timeLimit: undefined,
      totalPoints: 0,
      instructions: ''
    });
    setShowAssessmentBuilder(false);
  };

  const addOptionToQuestion = () => {
    const currentOptions = currentQuestion.options || [];
    if (currentOptions.length < 5) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: [...currentOptions, '']
      }));
    }
  };

  const removeOptionFromQuestion = (index: number) => {
    const currentOptions = currentQuestion.options || [];
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, i) => i !== index);
      const newCorrectAnswers = (currentQuestion.correctAnswers || []).filter(answer => 
        newOptions.includes(answer)
      );
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions,
        correctAnswers: newCorrectAnswers
      }));
    }
  };

  const updateQuestionOption = (index: number, value: string) => {
    const currentOptions = [...(currentQuestion.options || [])];
    const oldValue = currentOptions[index];
    currentOptions[index] = value;
    
    // Update correct answers if the option was previously selected
    const correctAnswers = [...(currentQuestion.correctAnswers || [])];
    const correctIndex = correctAnswers.indexOf(oldValue);
    if (correctIndex !== -1) {
      correctAnswers[correctIndex] = value;
    }
    
    setCurrentQuestion(prev => ({
      ...prev,
      options: currentOptions,
      correctAnswers: correctAnswers
    }));
  };

  const toggleCorrectAnswer = (option: string) => {
    const currentCorrect = currentQuestion.correctAnswers || [];
    const isCurrentlyCorrect = currentCorrect.includes(option);
    
    if (currentQuestion.allowMultiple) {
      // Multiple selection allowed
      if (isCurrentlyCorrect) {
        setCurrentQuestion(prev => ({
          ...prev,
          correctAnswers: currentCorrect.filter(answer => answer !== option)
        }));
      } else {
        setCurrentQuestion(prev => ({
          ...prev,
          correctAnswers: [...currentCorrect, option]
        }));
      }
    } else {
      // Single selection only
      setCurrentQuestion(prev => ({
        ...prev,
        correctAnswers: isCurrentlyCorrect ? [] : [option]
      }));
    }
  };

  const addBlankAnswer = () => {
    const currentBlanks = currentQuestion.blanks || [];
    setCurrentQuestion(prev => ({
      ...prev,
      blanks: [...currentBlanks, '']
    }));
  };

  const removeBlankAnswer = (index: number) => {
    const currentBlanks = currentQuestion.blanks || [];
    if (currentBlanks.length > 1) {
      setCurrentQuestion(prev => ({
        ...prev,
        blanks: currentBlanks.filter((_, i) => i !== index)
      }));
    }
  };

  const updateBlankAnswer = (index: number, value: string) => {
    const currentBlanks = [...(currentQuestion.blanks || [])];
    currentBlanks[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      blanks: currentBlanks
    }));
  };

  const addEnumerationAnswer = () => {
    const currentAnswers = currentQuestion.correctAnswers || [];
    setCurrentQuestion(prev => ({
      ...prev,
      correctAnswers: [...currentAnswers, '']
    }));
  };

  const removeEnumerationAnswer = (index: number) => {
    const currentAnswers = currentQuestion.correctAnswers || [];
    if (currentAnswers.length > 1) {
      setCurrentQuestion(prev => ({
        ...prev,
        correctAnswers: currentAnswers.filter((_, i) => i !== index)
      }));
    }
  };

  const updateEnumerationAnswer = (index: number, value: string) => {
    const currentAnswers = [...(currentQuestion.correctAnswers || [])];
    currentAnswers[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      correctAnswers: currentAnswers
    }));
  };

  // Chat Functions
  const sendMessage = () => {
    if (!newMessage.trim() && chatAttachmentType === 'none') return;

    let attachment = undefined;
    if (chatAttachmentType === 'pdf' && chatAttachment) {
      attachment = {
        type: 'pdf' as const,
        content: URL.createObjectURL(chatAttachment),
        fileName: chatAttachment.name
      };
    } else if (chatAttachmentType === 'youtube' && chatYouTubeUrl.trim()) {
      attachment = {
        type: 'youtube' as const,
        content: chatYouTubeUrl
      };
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      timestamp: new Date(),
      attachment
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    setChatAttachment(null);
    setChatYouTubeUrl('');
    setChatAttachmentType('none');
  };

  const renderLevels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {schoolLevels.map((level) => (
          <div
            key={level.id}
            onClick={() => {
              setSelectedLevel(level);
              setCurrentView('sections');
            }}
            className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
              <p className="text-gray-600">{level.sections.length} sections</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSections = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('levels')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{selectedLevel?.name}</h1>
        </div>
        <button
          onClick={() => setShowAddSection(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      {selectedLevel?.sections.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No sections yet</h3>
          <p className="text-gray-500">Create your first section to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedLevel?.sections
            .sort((a, b) => a.number - b.number)
            .map((section) => (
              <div
                key={section.id}
                onClick={() => {
                  setSelectedSection(section);
                  setCurrentView('section-detail');
                }}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    Section {section.number}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{section.students.length} students</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Section</h2>
              <button
                onClick={() => setShowAddSection(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Name
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Grade 1 - Section A"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddSection(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addSection}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSectionDetail = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('sections')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedSection?.name}</h1>
            <p className="text-gray-600">{selectedSection?.students.length} students enrolled</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddStudent(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => setShowCreateContent(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Content</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'modules', label: 'Learning Modules', icon: BookOpen },
            { key: 'quizzes', label: 'Quizzes', icon: ClipboardCheck },
            { key: 'assessments', label: 'Assessments', icon: FileText },
            { key: 'exams', label: 'Exams', icon: GraduationCap },
            { key: 'chat', label: 'Class Chat', icon: MessageSquare }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Students List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Students</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedSection?.students.map((student) => (
              <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-sm text-gray-500 truncate">{student.email}</p>
                  {student.phone && (
                    <p className="text-sm text-gray-500">{student.phone}</p>
                  )}
                </div>
              </div>
            ))}
            {selectedSection?.students.length === 0 && (
              <p className="text-gray-500 text-center py-4">No students enrolled</p>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'modules' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Modules</h3>
              {learningModules.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No learning modules yet</p>
                  <p className="text-sm text-gray-400">Create your first module to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {learningModules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
                          <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              module.type === 'pdf' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {module.type === 'pdf' ? 'PDF' : 'Video'}
                            </span>
                            {module.fileName && (
                              <span className="text-xs text-gray-500">{module.fileName}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {module.type === 'pdf' ? (
                            <>
                              <a
                                href={module.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                              >
                                <Eye className="h-3 w-3" />
                                <span>View</span>
                              </a>
                              <a
                                href={module.content}
                                download={module.fileName}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                              >
                                <Download className="h-3 w-3" />
                                <span>Download</span>
                              </a>
                            </>
                          ) : (
                            <a
                              href={module.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Watch</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quizzes</h3>
              {quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No quizzes yet</p>
                  <p className="text-sm text-gray-400">Create your first quiz to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{quiz.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Hash className="h-3 w-3" />
                              <span>{quiz.questions.length} questions</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>📊</span>
                              <span>{quiz.totalPoints} points</span>
                            </span>
                            {quiz.timeLimit && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{quiz.timeLimit} min</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                            Edit
                          </button>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assessments</h3>
              {assessments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No assessments yet</p>
                  <p className="text-sm text-gray-400">Create your first assessment to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{assessment.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Hash className="h-3 w-3" />
                              <span>{assessment.questions.length} questions</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>📊</span>
                              <span>{assessment.totalPoints} points</span>
                            </span>
                            {assessment.timeLimit && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{assessment.timeLimit} min</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                            Edit
                          </button>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Exams</h3>
              {exams.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No exams yet</p>
                  <p className="text-sm text-gray-400">Create your first exam to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{exam.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Hash className="h-3 w-3" />
                              <span>{exam.questions.length} questions</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>📊</span>
                              <span>{exam.totalPoints} points</span>
                            </span>
                            {exam.timeLimit && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{exam.timeLimit} min</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                            Edit
                          </button>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="bg-white rounded-xl border border-gray-200 h-96 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Class Chat</h3>
                <p className="text-sm text-gray-500">Only teachers can send messages</p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-blue-900">Teacher</span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {message.message && (
                        <p className="text-gray-800 mb-2">{message.message}</p>
                      )}
                      {message.attachment && (
                        <div className="mt-2">
                          {message.attachment.type === 'pdf' ? (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-red-600" />
                              <a
                                href={message.attachment.content}
                                download={message.attachment.fileName}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                {message.attachment.fileName}
                              </a>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Youtube className="h-4 w-4 text-red-600" />
                              <a
                                href={message.attachment.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Watch Video
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-3">
                  {chatAttachmentType !== 'none' && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {chatAttachmentType === 'pdf' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload PDF
                          </label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setChatAttachment(e.target.files?.[0] || null)}
                            className="w-full text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            value={chatYouTubeUrl}
                            onChange={(e) => setChatYouTubeUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      onClick={() => setChatAttachmentType(chatAttachmentType === 'pdf' ? 'none' : 'pdf')}
                      className={`p-2 rounded-lg transition-colors ${
                        chatAttachmentType === 'pdf' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setChatAttachmentType(chatAttachmentType === 'youtube' ? 'none' : 'youtube')}
                      className={`p-2 rounded-lg transition-colors ${
                        chatAttachmentType === 'youtube' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Youtube className="h-4 w-4" />
                    </button>
                    <button
                      onClick={sendMessage}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Student</h2>
              <button
                onClick={() => setShowAddStudent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="09123456789 or +639123456789"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 09XXXXXXXXX (will auto-convert to +63)
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addStudent}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Content Modal */}
      {showCreateContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Content</h2>
              <button
                onClick={() => setShowCreateContent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setContentType('module')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  contentType === 'module'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Learning Module</h3>
                <p className="text-sm text-gray-600">Upload PDFs or embed videos</p>
              </button>
              <button
                onClick={() => setContentType('quiz')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  contentType === 'quiz'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ClipboardCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Quiz</h3>
                <p className="text-sm text-gray-600">Create interactive quizzes</p>
              </button>
              <button
                onClick={() => setContentType('assessment')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  contentType === 'assessment'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Assessment</h3>
                <p className="text-sm text-gray-600">Create detailed assessments</p>
              </button>
              <button
                onClick={() => setContentType('exam')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  contentType === 'exam'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Exam</h3>
                <p className="text-sm text-gray-600">Create comprehensive exams</p>
              </button>
            </div>

            {/* Content Creation Form */}
            {contentType === 'module' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title
                  </label>
                  <input
                    type="text"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter module title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setUploadType('pdf')}
                      className={`flex items-center space-x-2 p-3 border rounded-lg transition-all ${
                        uploadType === 'pdf'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Upload className="h-5 w-5" />
                      <span>Upload PDF</span>
                    </button>
                    <button
                      onClick={() => setUploadType('youtube')}
                      className={`flex items-center space-x-2 p-3 border rounded-lg transition-all ${
                        uploadType === 'youtube'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Youtube className="h-5 w-5" />
                      <span>YouTube Video</span>
                    </button>
                  </div>
                  
                  {uploadType === 'pdf' ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload PDF file</p>
                        {selectedFile && (
                          <p className="text-sm text-blue-600 mt-2">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a valid YouTube URL
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the learning module"
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateContent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={createContent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Create Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Builder Modal */}
      {showAssessmentBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create {currentAssessment.type?.charAt(0).toUpperCase()}{currentAssessment.type?.slice(1)}
              </h2>
              <button
                onClick={() => setShowAssessmentBuilder(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Assessment Details */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentAssessment.type?.charAt(0).toUpperCase()}{currentAssessment.type?.slice(1)} Title
                  </label>
                  <input
                    type="text"
                    value={currentAssessment.title || ''}
                    onChange={(e) => setCurrentAssessment(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${currentAssessment.type} title`}
                  />
                </div>

                {currentAssessment.type === 'exam' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={currentAssessment.timeLimit || ''}
                      onChange={(e) => setCurrentAssessment(prev => ({ 
                        ...prev, 
                        timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter time limit"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={currentAssessment.instructions || ''}
                    onChange={(e) => setCurrentAssessment(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter instructions for students"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Questions: {currentAssessment.questions?.length || 0}</p>
                    <p>Total Points: {currentAssessment.totalPoints || 0}</p>
                    {currentAssessment.timeLimit && (
                      <p>Time Limit: {currentAssessment.timeLimit} minutes</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowQuestionBuilder(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>

                <button
                  onClick={saveAssessment}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save {currentAssessment.type?.charAt(0).toUpperCase()}{currentAssessment.type?.slice(1)}</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Questions</h3>
                {currentAssessment.questions?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No questions added yet</p>
                    <p className="text-sm text-gray-400">Click "Add Question" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentAssessment.questions?.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                Question {index + 1}
                              </span>
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                {question.type.replace('-', ' ')}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {question.points} pts
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                            
                            {question.type === 'multiple-choice' && (
                              <div className="space-y-1">
                                {question.options?.map((option, optIndex) => (
                                  <div key={optIndex} className={`text-sm p-2 rounded ${
                                    question.correctAnswers.includes(option)
                                      ? 'bg-green-100 text-green-800 font-medium'
                                      : 'bg-gray-50 text-gray-600'
                                  }`}>
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {question.type === 'fill-blank' && (
                              <div className="text-sm text-gray-600">
                                <p>Correct answers: {question.correctAnswers.join(', ')}</p>
                              </div>
                            )}
                            
                            {question.type === 'enumeration' && (
                              <div className="text-sm text-gray-600">
                                <p>Expected answers: {question.correctAnswers.join(', ')}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editQuestion(index)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteQuestion(index)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Builder Modal */}
      {showQuestionBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={() => {
                  setShowQuestionBuilder(false);
                  setEditingQuestionIndex(null);
                  setCurrentQuestion({
                    type: 'multiple-choice',
                    question: '',
                    options: ['', ''],
                    correctAnswers: [],
                    points: 1,
                    allowMultiple: false,
                    blanks: ['']
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Question Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'multiple-choice', label: 'Multiple Choice', icon: CheckSquare },
                      { key: 'fill-blank', label: 'Fill in the Blanks', icon: Type },
                      { key: 'enumeration', label: 'Enumeration', icon: List }
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setCurrentQuestion(prev => ({ 
                          ...prev, 
                          type: key as any,
                          options: key === 'multiple-choice' ? ['', ''] : undefined,
                          correctAnswers: [],
                          blanks: key === 'fill-blank' ? [''] : undefined
                        }))}
                        className={`flex items-center space-x-2 p-3 border rounded-lg transition-all ${
                          currentQuestion.type === key
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    rows={3}
                    value={currentQuestion.question || ''}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your question here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentQuestion.points || 1}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Question Content */}
              <div className="space-y-4">
                {currentQuestion.type === 'multiple-choice' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Answer Options
                      </label>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={currentQuestion.allowMultiple || false}
                            onChange={(e) => setCurrentQuestion(prev => ({ 
                              ...prev, 
                              allowMultiple: e.target.checked,
                              correctAnswers: e.target.checked ? prev.correctAnswers : prev.correctAnswers?.slice(0, 1) || []
                            }))}
                            className="rounded"
                          />
                          <span>Allow multiple correct answers</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type={currentQuestion.allowMultiple ? 'checkbox' : 'radio'}
                            name="correct-answer"
                            checked={currentQuestion.correctAnswers?.includes(option) || false}
                            onChange={() => toggleCorrectAnswer(option)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateQuestionOption(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          />
                          {currentQuestion.options!.length > 2 && (
                            <button
                              onClick={() => removeOptionFromQuestion(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {currentQuestion.options!.length < 5 && (
                      <button
                        onClick={addOptionToQuestion}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Option</span>
                      </button>
                    )}
                  </div>
                )}

                {currentQuestion.type === 'fill-blank' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answers (one per line)
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.blanks?.map((blank, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={blank}
                            onChange={(e) => updateBlankAnswer(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Answer ${index + 1}`}
                          />
                          {currentQuestion.blanks!.length > 1 && (
                            <button
                              onClick={() => removeBlankAnswer(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addBlankAnswer}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Answer</span>
                    </button>
                  </div>
                )}

                {currentQuestion.type === 'enumeration' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Answers
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.correctAnswers?.map((answer, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => updateEnumerationAnswer(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Answer ${index + 1}`}
                          />
                          {currentQuestion.correctAnswers!.length > 1 && (
                            <button
                              onClick={() => removeEnumerationAnswer(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addEnumerationAnswer}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Answer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowQuestionBuilder(false);
                  setEditingQuestionIndex(null);
                  setCurrentQuestion({
                    type: 'multiple-choice',
                    question: '',
                    options: ['', ''],
                    correctAnswers: [],
                    points: 1,
                    allowMultiple: false,
                    blanks: ['']
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addQuestionToAssessment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {currentView === 'levels' && renderLevels()}
        {currentView === 'sections' && renderSections()}
        {currentView === 'section-detail' && renderSectionDetail()}
      </div>
    </div>
  );
};

export default TeacherDashboard;