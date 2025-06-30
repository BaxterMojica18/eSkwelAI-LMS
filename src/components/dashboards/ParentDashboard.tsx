import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  Download,
  FileText,
  Printer,
  CreditCard,
  BookOpen,
  Bus,
  GraduationCap,
  Heart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  RefreshCw,
  LogOut,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  profile_image_url: string | null;
  grade_level: string;
  section: string;
}

interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  amount: number;
  currency: string;
  description: string;
  payment_type: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string | null;
  paid_date: string | null;
  payment_method: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface StudentBalance {
  student_id: string;
  student_name: string;
  total_due: number;
  overdue_amount: number;
  paid_amount: number;
  pending_amount: number;
  last_payment_date: string | null;
  payment_breakdown: {
    tuition: number;
    books: number;
    miscellaneous: number;
    school_trip: number;
    prom: number;
    other: number;
  };
}

interface ParentDashboardProps {
  onSignOut: () => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balances, setBalances] = useState<StudentBalance[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample students (children of the parent)
    const sampleStudents: Student[] = [
      {
        id: '1',
        first_name: 'Emma',
        last_name: 'Smith',
        email: 'emma.smith@demoschool.edu',
        phone: null,
        profile_image_url: null,
        grade_level: 'Grade 1',
        section: 'A'
      },
      {
        id: '2',
        first_name: 'James',
        last_name: 'Smith',
        email: 'james.smith@demoschool.edu',
        phone: null,
        profile_image_url: null,
        grade_level: 'Grade 2',
        section: 'B'
      }
    ];

    // Sample payments for both children
    const samplePayments: Payment[] = [
      // Emma's payments
      {
        id: '1',
        student_id: '1',
        student_name: 'Emma Smith',
        amount: 500.00,
        currency: 'USD',
        description: 'First Quarter Tuition Fee',
        payment_type: 'Tuition',
        status: 'paid',
        due_date: '2025-01-15',
        paid_date: '2025-01-10',
        payment_method: 'Credit Card',
        transaction_id: 'TXN001',
        notes: 'Paid in full',
        created_at: '2025-01-01',
        updated_at: '2025-01-10'
      },
      {
        id: '2',
        student_id: '1',
        student_name: 'Emma Smith',
        amount: 150.00,
        currency: 'USD',
        description: 'Mathematics Textbook',
        payment_type: 'Books',
        status: 'pending',
        due_date: '2025-02-01',
        paid_date: null,
        payment_method: null,
        transaction_id: null,
        notes: 'Required textbook for Grade 1',
        created_at: '2025-01-15',
        updated_at: '2025-01-15'
      },
      {
        id: '3',
        student_id: '1',
        student_name: 'Emma Smith',
        amount: 200.00,
        currency: 'USD',
        description: 'Science Museum Field Trip',
        payment_type: 'School Trip',
        status: 'overdue',
        due_date: '2025-01-20',
        paid_date: null,
        payment_method: null,
        transaction_id: null,
        notes: 'Educational field trip',
        created_at: '2025-01-05',
        updated_at: '2025-01-05'
      },
      // James's payments
      {
        id: '4',
        student_id: '2',
        student_name: 'James Smith',
        amount: 500.00,
        currency: 'USD',
        description: 'First Quarter Tuition Fee',
        payment_type: 'Tuition',
        status: 'paid',
        due_date: '2025-01-15',
        paid_date: '2025-01-12',
        payment_method: 'Bank Transfer',
        transaction_id: 'TXN002',
        notes: 'Paid via online banking',
        created_at: '2025-01-01',
        updated_at: '2025-01-12'
      },
      {
        id: '5',
        student_id: '2',
        student_name: 'James Smith',
        amount: 125.00,
        currency: 'USD',
        description: 'Science Workbook Set',
        payment_type: 'Books',
        status: 'paid',
        due_date: '2025-01-25',
        paid_date: '2025-01-20',
        payment_method: 'Credit Card',
        transaction_id: 'TXN003',
        notes: 'Grade 2 science materials',
        created_at: '2025-01-10',
        updated_at: '2025-01-20'
      },
      {
        id: '6',
        student_id: '2',
        student_name: 'James Smith',
        amount: 50.00,
        currency: 'USD',
        description: 'Library Late Fee',
        payment_type: 'Miscellaneous',
        status: 'pending',
        due_date: '2025-02-10',
        paid_date: null,
        payment_method: null,
        transaction_id: null,
        notes: 'Overdue book charges',
        created_at: '2025-01-18',
        updated_at: '2025-01-18'
      }
    ];

    // Calculate balances for each student
    const studentBalances: StudentBalance[] = sampleStudents.map(student => {
      const studentPayments = samplePayments.filter(p => p.student_id === student.id);
      
      const totalDue = studentPayments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const paidAmount = studentPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pendingAmount = studentPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const overdueAmount = studentPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      const lastPayment = studentPayments
        .filter(p => p.status === 'paid' && p.paid_date)
        .sort((a, b) => new Date(b.paid_date!).getTime() - new Date(a.paid_date!).getTime())[0];

      // Calculate breakdown by payment type
      const breakdown = {
        tuition: studentPayments.filter(p => p.payment_type.toLowerCase().includes('tuition') && p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
        books: studentPayments.filter(p => p.payment_type.toLowerCase().includes('book') && p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
        miscellaneous: studentPayments.filter(p => p.payment_type.toLowerCase().includes('misc') && p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
        school_trip: studentPayments.filter(p => p.payment_type.toLowerCase().includes('trip') && p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
        prom: studentPayments.filter(p => p.payment_type.toLowerCase().includes('prom') && p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0),
        other: studentPayments.filter(p => !['tuition', 'book', 'misc', 'trip', 'prom'].some(type => p.payment_type.toLowerCase().includes(type)) && p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0)
      };

      return {
        student_id: student.id,
        student_name: `${student.first_name} ${student.last_name}`,
        total_due: totalDue,
        overdue_amount: overdueAmount,
        paid_amount: paidAmount,
        pending_amount: pendingAmount,
        last_payment_date: lastPayment?.paid_date || null,
        payment_breakdown: breakdown
      };
    });

    setStudents(sampleStudents);
    setPayments(samplePayments);
    setBalances(studentBalances);
    setLoading(false);
  };

  const getPaymentTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('tuition')) return <GraduationCap className="h-4 w-4" />;
    if (lowerType.includes('book')) return <BookOpen className="h-4 w-4" />;
    if (lowerType.includes('trip')) return <Bus className="h-4 w-4" />;
    if (lowerType.includes('prom')) return <Heart className="h-4 w-4" />;
    if (lowerType.includes('misc')) return <Package className="h-4 w-4" />;
    return <DollarSign className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': case 'failed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.payment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    const matchesStudent = !selectedStudent || payment.student_id === selectedStudent;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(payment.created_at);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = paymentDate >= startDate && paymentDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesStudent && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parent dashboard...</p>
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
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, Jennifer!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={generateSampleData}
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
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'balances', label: 'Account Balances', icon: DollarSign },
              { id: 'payments', label: 'Payment History', icon: CreditCard },
              { id: 'due-fees', label: 'Due Fees', icon: AlertTriangle }
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Children</p>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                    <p className="text-3xl font-bold text-red-600">
                      ${balances.reduce((sum, b) => sum + b.total_due, 0).toFixed(2)}
                    </p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                    <p className="text-3xl font-bold text-orange-600">
                      ${balances.reduce((sum, b) => sum + b.overdue_amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <Clock className="h-12 w-12 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Paid</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${balances.reduce((sum, b) => sum + b.paid_amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* Children Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">My Children</h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((student) => {
                    const balance = balances.find(b => b.student_id === student.id);
                    return (
                      <div key={student.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {student.first_name} {student.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Current Enrollment:</p>
                          <p className="text-sm text-gray-600">
                            {student.grade_level} - Section {student.section}
                          </p>
                        </div>

                        {balance && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Outstanding:</span>
                              <span className={`font-medium ${balance.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${balance.total_due.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Paid:</span>
                              <span className="font-medium text-green-600">${balance.paid_amount.toFixed(2)}</span>
                            </div>
                            {balance.overdue_amount > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Overdue:</span>
                                <span className="font-medium text-red-600">${balance.overdue_amount.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Balances Tab */}
        {activeTab === 'balances' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Account Balances</h2>
            </div>

            <div className="space-y-6">
              {balances.map((balance) => (
                <div key={balance.student_id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{balance.student_name}</h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Outstanding</p>
                        <p className={`text-2xl font-bold ${balance.total_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${balance.total_due.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Summary */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Account Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Paid:</span>
                            <span className="font-medium text-green-600">${balance.paid_amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pending:</span>
                            <span className="font-medium text-yellow-600">${balance.pending_amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overdue:</span>
                            <span className="font-medium text-red-600">${balance.overdue_amount.toFixed(2)}</span>
                          </div>
                          {balance.last_payment_date && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Payment:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(balance.last_payment_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="font-medium text-gray-900">Outstanding Fees Breakdown</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(balance.payment_breakdown).map(([type, amount]) => (
                            <div key={type} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                {getPaymentTypeIcon(type)}
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {type.replace('_', ' ')}
                                </span>
                              </div>
                              <p className={`text-lg font-bold ${amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${amount.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search payments..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                  <select
                    value={selectedStudent || ''}
                    onChange={(e) => setSelectedStudent(e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Students</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.student_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{payment.description}</div>
                          {payment.notes && (
                            <div className="text-sm text-gray-500">{payment.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getPaymentTypeIcon(payment.payment_type)}
                            <span className="text-sm text-gray-900">{payment.payment_type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${payment.amount.toFixed(2)} {payment.currency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No payment records found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Due Fees Tab */}
        {activeTab === 'due-fees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Due Fees</h2>
            </div>

            <div className="space-y-6">
              {students.map((student) => {
                const studentDuePayments = payments.filter(p => 
                  p.student_id === student.id && (p.status === 'pending' || p.status === 'overdue')
                );

                if (studentDuePayments.length === 0) return null;

                const totalDue = studentDuePayments.reduce((sum, p) => sum + p.amount, 0);
                const overduePayments = studentDuePayments.filter(p => p.status === 'overdue');

                return (
                  <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {student.first_name} {student.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Due</p>
                          <p className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</p>
                          {overduePayments.length > 0 && (
                            <p className="text-sm text-orange-600">{overduePayments.length} overdue</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {studentDuePayments.map((payment) => {
                          const daysOverdue = payment.due_date && payment.status === 'overdue' 
                            ? Math.floor((new Date().getTime() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24))
                            : 0;

                          return (
                            <div key={payment.id} className={`border rounded-lg p-4 ${
                              payment.status === 'overdue' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {getPaymentTypeIcon(payment.payment_type)}
                                  <div>
                                    <h4 className="font-medium text-gray-900">{payment.description}</h4>
                                    <p className="text-sm text-gray-600">{payment.payment_type}</p>
                                    {payment.notes && (
                                      <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900">${payment.amount.toFixed(2)}</p>
                                  <div className="flex items-center space-x-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </span>
                                    {payment.status === 'overdue' && daysOverdue > 0 && (
                                      <span className="text-xs text-red-600 font-medium">
                                        {daysOverdue} days overdue
                                      </span>
                                    )}
                                  </div>
                                  {payment.due_date && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      Due: {new Date(payment.due_date).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {payments.filter(p => p.status === 'pending' || p.status === 'overdue').length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-600">No outstanding fees at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;