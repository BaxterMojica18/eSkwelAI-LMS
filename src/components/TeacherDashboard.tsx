import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  QrCode,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import QREnrollmentManager from './QREnrollmentManager';

interface Section {
  id: string;
  name: string;
  school_levels?: {
    name: string;
  };
  _count?: {
    enrollments: number;
  };
}

interface LearningModule {
  id: string;
  title: string;
  description: string | null;
  type: 'pdf' | 'video';
  content_url: string;
  file_size: number | null;
  duration_minutes: number | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string | null;
  type: 'quiz' | 'exam' | 'assessment';
  total_points: number;
  passing_score: number;
  is_published: boolean;
  due_date: string | null;
  created_at: string;
  _count?: {
    questions: number;
  };
}

interface Question {
  id: string;
  question_text: string;
  type: 'multiple_choice' | 'fill_blank' | 'enumeration';
  options: any[];
  correct_answers: any[];
  points: number;
  order_index: number;
  explanation: string | null;
}

type TabType = 'overview' | 'modules' | 'assessments' | 'students' | 'qr-enrollment' | 'analytics';

const TeacherDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSchoolYear] = useState(new Date().getFullYear().toString());

  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    type: 'pdf' as 'pdf' | 'video',
    content_url: '',
    duration_minutes: ''
  });

  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    type: 'quiz' as 'quiz' | 'exam' | 'assessment',
    instructions: '',
    time_limit_minutes: '',
    passing_score: '',
    due_date: ''
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    type: 'multiple_choice' as 'multiple_choice' | 'fill_blank' | 'enumeration',
    options: ['', ''],
    correct_answers: [] as any[],
    points: 1,
    explanation: ''
  });

  useEffect(() => {
    if (profile?.id) {
      fetchSections();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedSection) {
      if (activeTab === 'modules') {
        fetchModules();
      } else if (activeTab === 'assessments') {
        fetchAssessments();
      }
    }
  }, [selectedSection, activeTab]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_sections')
        .select(`
          section_id,
          sections!inner (
            id,
            name,
            school_levels (
              name
            )
          )
        `)
        .eq('teacher_id', profile?.id)
        .eq('school_year', currentSchoolYear);

      if (error) throw error;

      const sectionData = data?.map(ts => ({
        id: ts.sections.id,
        name: ts.sections.name,
        school_levels: ts.sections.school_levels
      })) || [];

      setSections(sectionData);
      if (sectionData.length > 0 && !selectedSection) {
        setSelectedSection(sectionData[0].id);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    if (!selectedSection) return;

    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('section_id', selectedSection)
        .order('order_index');

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchAssessments = async () => {
    if (!selectedSection) return;

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('section_id', selectedSection)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const fetchQuestions = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('order_index');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      const moduleData = {
        section_id: selectedSection,
        teacher_id: profile?.id,
        title: moduleForm.title,
        description: moduleForm.description || null,
        type: moduleForm.type,
        content_url: moduleForm.content_url,
        duration_minutes: moduleForm.duration_minutes ? parseInt(moduleForm.duration_minutes) : null,
        order_index: modules.length,
        is_published: false
      };

      if (editingModule) {
        const { error } = await supabase
          .from('learning_modules')
          .update(moduleData)
          .eq('id', editingModule.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('learning_modules')
          .insert(moduleData);

        if (error) throw error;
      }

      setShowModuleModal(false);
      setEditingModule(null);
      setModuleForm({
        title: '',
        description: '',
        type: 'pdf',
        content_url: '',
        duration_minutes: ''
      });
      fetchModules();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      const assessmentData = {
        section_id: selectedSection,
        teacher_id: profile?.id,
        title: assessmentForm.title,
        description: assessmentForm.description || null,
        type: assessmentForm.type,
        instructions: assessmentForm.instructions || null,
        time_limit_minutes: assessmentForm.time_limit_minutes ? parseInt(assessmentForm.time_limit_minutes) : null,
        passing_score: assessmentForm.passing_score ? parseInt(assessmentForm.passing_score) : 0,
        due_date: assessmentForm.due_date || null,
        is_published: false
      };

      if (editingAssessment) {
        const { error } = await supabase
          .from('assessments')
          .update(assessmentData)
          .eq('id', editingAssessment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('assessments')
          .insert(assessmentData);

        if (error) throw error;
      }

      setShowAssessmentModal(false);
      setEditingAssessment(null);
      setAssessmentForm({
        title: '',
        description: '',
        type: 'quiz',
        instructions: '',
        time_limit_minutes: '',
        passing_score: '',
        due_date: ''
      });
      fetchAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAssessmentId) return;

    try {
      let correctAnswers = [];
      
      if (questionForm.type === 'multiple_choice') {
        correctAnswers = questionForm.correct_answers;
      } else if (questionForm.type === 'fill_blank') {
        correctAnswers = questionForm.correct_answers.filter(answer => answer.trim() !== '');
      } else if (questionForm.type === 'enumeration') {
        correctAnswers = questionForm.correct_answers.filter(answer => answer.trim() !== '');
      }

      const questionData = {
        assessment_id: currentAssessmentId,
        question_text: questionForm.question_text,
        type: questionForm.type,
        options: questionForm.type === 'multiple_choice' ? questionForm.options.filter(opt => opt.trim() !== '') : [],
        correct_answers: correctAnswers,
        points: questionForm.points,
        order_index: questions.length,
        explanation: questionForm.explanation || null
      };

      const { error } = await supabase
        .from('questions')
        .insert(questionData);

      if (error) throw error;

      // Update assessment total points
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0) + questionForm.points;
      await supabase
        .from('assessments')
        .update({ total_points: totalPoints })
        .eq('id', currentAssessmentId);

      setShowQuestionModal(false);
      setQuestionForm({
        question_text: '',
        type: 'multiple_choice',
        options: ['', ''],
        correct_answers: [],
        points: 1,
        explanation: ''
      });
      fetchQuestions(currentAssessmentId);
      fetchAssessments();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const { error } = await supabase
        .from('learning_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment? This will also delete all questions.')) return;

    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  const toggleModulePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('learning_modules')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchModules();
    } catch (error) {
      console.error('Error updating module status:', error);
    }
  };

  const toggleAssessmentPublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('assessments')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAssessments();
    } catch (error) {
      console.error('Error updating assessment status:', error);
    }
  };

  const addOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length <= 2) return;
    
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correct_answers: prev.correct_answers.filter(answer => answer !== index)
    }));
  };

  const updateOption = (index: number, value: string) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const toggleCorrectAnswer = (index: number) => {
    setQuestionForm(prev => {
      const isSelected = prev.correct_answers.includes(index);
      return {
        ...prev,
        correct_answers: isSelected
          ? prev.correct_answers.filter(answer => answer !== index)
          : [...prev.correct_answers, index]
      };
    });
  };

  const addCorrectAnswer = () => {
    setQuestionForm(prev => ({
      ...prev,
      correct_answers: [...prev.correct_answers, '']
    }));
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    setQuestionForm(prev => ({
      ...prev,
      correct_answers: prev.correct_answers.map((answer, i) => i === index ? value : answer)
    }));
  };

  const removeCorrectAnswer = (index: number) => {
    setQuestionForm(prev => ({
      ...prev,
      correct_answers: prev.correct_answers.filter((_, i) => i !== index)
    }));
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'modules', label: 'Learning Modules', icon: BookOpen },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'qr-enrollment', label: 'QR Enrollment', icon: QrCode },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              {sections.length > 0 && (
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.school_levels?.name} - {section.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Welcome, {profile?.first_name} {profile?.last_name}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sections</p>
                  <p className="text-3xl font-bold text-gray-900">{sections.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Modules</p>
                  <p className="text-3xl font-bold text-gray-900">{modules.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assessments</p>
                  <p className="text-3xl font-bold text-gray-900">{assessments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published Content</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {modules.filter(m => m.is_published).length + assessments.filter(a => a.is_published).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Learning Modules</h2>
              <button
                onClick={() => setShowModuleModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {module.type === 'pdf' ? (
                        <FileText className="h-8 w-8 text-red-600" />
                      ) : (
                        <Play className="h-8 w-8 text-blue-600" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{module.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleModulePublish(module.id, module.is_published)}
                        className={`p-2 rounded-lg transition-colors ${
                          module.is_published
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {module.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingModule(module);
                          setModuleForm({
                            title: module.title,
                            description: module.description || '',
                            type: module.type,
                            content_url: module.content_url,
                            duration_minutes: module.duration_minutes?.toString() || ''
                          });
                          setShowModuleModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {module.description && (
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      module.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {module.is_published ? 'Published' : 'Draft'}
                    </span>
                    {module.duration_minutes && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{module.duration_minutes} min</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {modules.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                <p className="text-gray-600 mb-4">Create your first learning module to get started</p>
                <button
                  onClick={() => setShowModuleModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Module
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Assessments</h2>
              <button
                onClick={() => setShowAssessmentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Assessment</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 capitalize">{assessment.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAssessmentPublish(assessment.id, assessment.is_published)}
                        className={`p-2 rounded-lg transition-colors ${
                          assessment.is_published
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {assessment.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingAssessment(assessment);
                          setAssessmentForm({
                            title: assessment.title,
                            description: assessment.description || '',
                            type: assessment.type,
                            instructions: assessment.instructions || '',
                            time_limit_minutes: assessment.time_limit_minutes?.toString() || '',
                            passing_score: assessment.passing_score.toString(),
                            due_date: assessment.due_date || ''
                          });
                          setShowAssessmentModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {assessment.description && (
                    <p className="text-gray-600 text-sm mb-4">{assessment.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Total Points:</span>
                      <span className="font-medium">{assessment.total_points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Score:</span>
                      <span className="font-medium">{assessment.passing_score}</span>
                    </div>
                    {assessment.due_date && (
                      <div className="flex justify-between">
                        <span>Due Date:</span>
                        <span className="font-medium">
                          {new Date(assessment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      assessment.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {assessment.is_published ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => {
                        setCurrentAssessmentId(assessment.id);
                        fetchQuestions(assessment.id);
                        setShowQuestionModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Manage Questions
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {assessments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                <p className="text-gray-600 mb-4">Create your first assessment to get started</p>
                <button
                  onClick={() => setShowAssessmentModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assessment
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'qr-enrollment' && <QREnrollmentManager />}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Student Management</h3>
              <p className="text-gray-600 mb-4">
                Student management features will be available here. Students can now enroll using QR codes!
              </p>
              <button
                onClick={() => setActiveTab('qr-enrollment')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <QrCode className="h-5 w-5" />
                <span>Manage QR Enrollment</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Detailed analytics and reporting features will be available here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingModule ? 'Edit Module' : 'Add Learning Module'}
                </h3>
                <button
                  onClick={() => {
                    setShowModuleModal(false);
                    setEditingModule(null);
                    setModuleForm({
                      title: '',
                      description: '',
                      type: 'pdf',
                      content_url: '',
                      duration_minutes: ''
                    });
                  }}
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
                    placeholder="Module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={moduleForm.type}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, type: e.target.value as 'pdf' | 'video' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content URL
                  </label>
                  <input
                    type="url"
                    required
                    value={moduleForm.content_url}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, content_url: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/content.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Module description"
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
                      onChange={(e) => setModuleForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Duration in minutes"
                    />
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModuleModal(false);
                      setEditingModule(null);
                      setModuleForm({
                        title: '',
                        description: '',
                        type: 'pdf',
                        content_url: '',
                        duration_minutes: ''
                      });
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingModule ? 'Update' : 'Create'} Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAssessment ? 'Edit Assessment' : 'Create Assessment'}
                </h3>
                <button
                  onClick={() => {
                    setShowAssessmentModal(false);
                    setEditingAssessment(null);
                    setAssessmentForm({
                      title: '',
                      description: '',
                      type: 'quiz',
                      instructions: '',
                      time_limit_minutes: '',
                      passing_score: '',
                      due_date: ''
                    });
                  }}
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
                    placeholder="Assessment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={assessmentForm.type}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, type: e.target.value as 'quiz' | 'exam' | 'assessment' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="assessment">Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={assessmentForm.description}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Assessment description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={assessmentForm.instructions}
                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Instructions for students"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={assessmentForm.time_limit_minutes}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, time_limit_minutes: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={assessmentForm.passing_score}
                      onChange={(e) => setAssessmentForm(prev => ({ ...prev, passing_score: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
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
                    onClick={() => {
                      setShowAssessmentModal(false);
                      setEditingAssessment(null);
                      setAssessmentForm({
                        title: '',
                        description: '',
                        type: 'quiz',
                        instructions: '',
                        time_limit_minutes: '',
                        passing_score: '',
                        due_date: ''
                      });
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingAssessment ? 'Update' : 'Create'} Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Question Management Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Manage Questions</h3>
                <button
                  onClick={() => {
                    setShowQuestionModal(false);
                    setCurrentAssessmentId('');
                    setQuestions([]);
                    setQuestionForm({
                      question_text: '',
                      type: 'multiple_choice',
                      options: ['', ''],
                      correct_answers: [],
                      points: 1,
                      explanation: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Existing Questions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Existing Questions ({questions.length})
                  </h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Question {index + 1} ({question.points} pts)
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {question.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2">{question.question_text}</p>
                        
                        {question.type === 'multiple_choice' && (
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className={`text-sm p-2 rounded ${
                                question.correct_answers.includes(optIndex)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-50 text-gray-700'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {(question.type === 'fill_blank' || question.type === 'enumeration') && (
                          <div className="text-sm">
                            <span className="text-gray-600">Correct answers: </span>
                            <span className="text-green-800 font-medium">
                              {Array.isArray(question.correct_answers) 
                                ? question.correct_answers.join(', ')
                                : question.correct_answers}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {questions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No questions added yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Add New Question */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Question</h4>
                  <form onSubmit={handleCreateQuestion} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        required
                        value={questionForm.question_text}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Type
                        </label>
                        <select
                          value={questionForm.type}
                          onChange={(e) => {
                            const newType = e.target.value as 'multiple_choice' | 'fill_blank' | 'enumeration';
                            setQuestionForm(prev => ({
                              ...prev,
                              type: newType,
                              options: newType === 'multiple_choice' ? ['', ''] : [],
                              correct_answers: []
                            }));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="fill_blank">Fill in the Blank</option>
                          <option value="enumeration">Enumeration</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={questionForm.points}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Multiple Choice Options */}
                    {questionForm.type === 'multiple_choice' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Answer Options
                          </label>
                          <button
                            type="button"
                            onClick={addOption}
                            disabled={questionForm.options.length >= 5}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {questionForm.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={questionForm.correct_answers.includes(index)}
                                onChange={() => toggleCorrectAnswer(index)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-600 w-6">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <input
                                type="text"
                                required
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              />
                              {questionForm.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Check the box(es) next to the correct answer(s)
                        </p>
                      </div>
                    )}

                    {/* Fill in the Blank / Enumeration Answers */}
                    {(questionForm.type === 'fill_blank' || questionForm.type === 'enumeration') && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Correct Answers
                          </label>
                          <button
                            type="button"
                            onClick={addCorrectAnswer}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Add Answer
                          </button>
                        </div>
                        <div className="space-y-2">
                          {questionForm.correct_answers.map((answer, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                required
                                value={answer}
                                onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Correct answer ${index + 1}`}
                              />
                              {questionForm.correct_answers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeCorrectAnswer(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          {questionForm.correct_answers.length === 0 && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                required
                                value=""
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, correct_answers: [e.target.value] }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter correct answer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={questionForm.explanation}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Explain the correct answer..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Add Question
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;