import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Save,
  Printer
} from 'lucide-react';

interface AccountingDashboardProps {
  onBack: () => void;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  balance: number;
  status: 'current' | 'overdue' | 'paid';
  email: string;
  phone: string;
  lastPayment?: string;
}

interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  type: 'tuition' | 'fees' | 'books' | 'uniform' | 'other';
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  paymentMethod?: string;
}

interface NewTransactionForm {
  studentId: string;
  type: string;
  amount: string;
  description: string;
  dueDate: string;
  paymentMethod: string;
}

interface MonthlyReport {
  month: string;
  year: number;
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  transactionCount: number;
  studentCount: number;
  paymentMethods: { [key: string]: number };
  feeTypes: { [key: string]: number };
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'monthly' | 'balances' | 'overdue'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data with more realistic information
  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', 
      name: 'Alice Johnson', 
      grade: '10th', 
      section: 'A', 
      balance: 1250.00, 
      status: 'current',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0101',
      lastPayment: '2025-01-15'
    },
    { 
      id: '2', 
      name: 'Bob Smith', 
      grade: '9th', 
      section: 'B', 
      balance: 850.00, 
      status: 'overdue',
      email: 'bob.smith@email.com',
      phone: '+1-555-0102',
      lastPayment: '2024-12-10'
    },
    { 
      id: '3', 
      name: 'Carol Davis', 
      grade: '11th', 
      section: 'A', 
      balance: 0.00, 
      status: 'paid',
      email: 'carol.davis@email.com',
      phone: '+1-555-0103',
      lastPayment: '2025-01-20'
    },
    { 
      id: '4', 
      name: 'David Wilson', 
      grade: '10th', 
      section: 'C', 
      balance: 1100.00, 
      status: 'current',
      email: 'david.wilson@email.com',
      phone: '+1-555-0104',
      lastPayment: '2025-01-12'
    },
    { 
      id: '5', 
      name: 'Emma Brown', 
      grade: '12th', 
      section: 'A', 
      balance: 750.00, 
      status: 'overdue',
      email: 'emma.brown@email.com',
      phone: '+1-555-0105',
      lastPayment: '2024-11-30'
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: '1', 
      studentId: '1',
      studentName: 'Alice Johnson', 
      type: 'tuition', 
      amount: 1200.00, 
      date: '2025-01-15', 
      status: 'paid', 
      description: 'Q1 Tuition Payment',
      paymentMethod: 'Credit Card'
    },
    { 
      id: '2', 
      studentId: '2',
      studentName: 'Bob Smith', 
      type: 'fees', 
      amount: 150.00, 
      date: '2025-01-10', 
      status: 'overdue', 
      description: 'Lab Fees',
      paymentMethod: 'Cash'
    },
    { 
      id: '3', 
      studentId: '3',
      studentName: 'Carol Davis', 
      type: 'books', 
      amount: 85.00, 
      date: '2025-01-12', 
      status: 'paid', 
      description: 'Textbook Purchase',
      paymentMethod: 'Bank Transfer'
    },
    { 
      id: '4', 
      studentId: '4',
      studentName: 'David Wilson', 
      type: 'uniform', 
      amount: 120.00, 
      date: '2025-01-08', 
      status: 'pending', 
      description: 'School Uniform',
      paymentMethod: 'Cash'
    },
    { 
      id: '5', 
      studentId: '5',
      studentName: 'Emma Brown', 
      type: 'tuition', 
      amount: 1200.00, 
      date: '2025-01-05', 
      status: 'overdue', 
      description: 'Q1 Tuition Payment',
      paymentMethod: 'Check'
    },
  ]);

  const [newTransactionForm, setNewTransactionForm] = useState<NewTransactionForm>({
    studentId: '',
    type: 'tuition',
    amount: '',
    description: '',
    dueDate: '',
    paymentMethod: 'cash'
  });

  const stats = {
    totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
    pendingPayments: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    overdueAmount: transactions.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0),
    totalStudents: students.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'current': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate Monthly Report
  const generateMonthlyReport = (): MonthlyReport => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
    });

    const paymentMethods: { [key: string]: number } = {};
    const feeTypes: { [key: string]: number } = {};

    monthTransactions.forEach(t => {
      if (t.paymentMethod) {
        paymentMethods[t.paymentMethod] = (paymentMethods[t.paymentMethod] || 0) + t.amount;
      }
      feeTypes[t.type] = (feeTypes[t.type] || 0) + t.amount;
    });

    return {
      month: monthNames[selectedMonth],
      year: selectedYear,
      totalRevenue: monthTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalCollected: monthTransactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0),
      totalPending: monthTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
      totalOverdue: monthTransactions.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0),
      transactionCount: monthTransactions.length,
      studentCount: new Set(monthTransactions.map(t => t.studentId)).size,
      paymentMethods,
      feeTypes
    };
  };

  // Get Student Balances Report
  const getStudentBalancesReport = () => {
    return students
      .filter(s => s.balance > 0)
      .sort((a, b) => b.balance - a.balance);
  };

  // Get Overdue Payments Report
  const getOverduePaymentsReport = () => {
    const overdueStudents = students.filter(s => s.status === 'overdue');
    const overdueTransactions = transactions.filter(t => t.status === 'overdue');
    
    return {
      students: overdueStudents,
      transactions: overdueTransactions,
      totalAmount: overdueStudents.reduce((sum, s) => sum + s.balance, 0),
      count: overdueStudents.length
    };
  };

  // Handle New Transaction
  const handleNewTransaction = () => {
    if (!newTransactionForm.studentId || !newTransactionForm.amount || !newTransactionForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const student = students.find(s => s.id === newTransactionForm.studentId);
    if (!student) {
      alert('Student not found');
      return;
    }

    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      studentId: newTransactionForm.studentId,
      studentName: student.name,
      type: newTransactionForm.type as any,
      amount: parseFloat(newTransactionForm.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: newTransactionForm.description,
      paymentMethod: newTransactionForm.paymentMethod
    };

    setTransactions([...transactions, newTransaction]);

    // Update student balance
    const updatedStudents = students.map(s => {
      if (s.id === newTransactionForm.studentId) {
        return {
          ...s,
          balance: s.balance + parseFloat(newTransactionForm.amount),
          status: 'current' as const
        };
      }
      return s;
    });
    setStudents(updatedStudents);

    // Reset form
    setNewTransactionForm({
      studentId: '',
      type: 'tuition',
      amount: '',
      description: '',
      dueDate: '',
      paymentMethod: 'cash'
    });

    setShowNewTransactionModal(false);
    alert('Transaction created successfully!');
  };

  // Print Report
  const printReport = () => {
    window.print();
  };

  // Export Report
  const exportReport = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">School Accounting</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowNewTransactionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Transaction</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">${stats.pendingPayments.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-yellow-600">{transactions.filter(t => t.status === 'pending').length} transactions</span>
              <span className="text-gray-500 ml-1">pending</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.overdueAmount.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600">{students.filter(s => s.status === 'overdue').length} students</span>
              <span className="text-gray-500 ml-1">with overdue payments</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600">{students.filter(s => s.status === 'paid').length} paid</span>
              <span className="text-gray-500 ml-1">in full</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'transactions', label: 'Transactions', icon: CreditCard },
                { id: 'reports', label: 'Reports', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Transactions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.studentName}</p>
                              <p className="text-sm text-gray-500">{transaction.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Status Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Paid</span>
                        </div>
                        <span className="font-semibold text-green-900">{students.filter(s => s.status === 'paid').length} students</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Current</span>
                        </div>
                        <span className="font-semibold text-blue-900">{students.filter(s => s.status === 'current').length} students</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="font-medium text-red-900">Overdue</span>
                        </div>
                        <span className="font-semibold text-red-900">{students.filter(s => s.status === 'overdue').length} students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button 
                    onClick={() => exportReport(filteredStudents, 'students_report')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade & Section
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.grade} - Section {student.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${student.balance.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                              {getStatusIcon(student.status)}
                              <span className="capitalize">{student.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.lastPayment || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button 
                    onClick={() => exportReport(filteredTransactions, 'transactions_report')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{transaction.studentName}</div>
                            <div className="text-sm text-gray-500">{transaction.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="capitalize text-sm text-gray-900">{transaction.type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                              <span className="capitalize">{transaction.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.paymentMethod || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Monthly Report</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Comprehensive monthly financial summary</p>
                    <button 
                      onClick={() => {
                        setReportType('monthly');
                        setShowReportModal(true);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate Report
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Student Balances</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Outstanding balances by student</p>
                    <button 
                      onClick={() => {
                        setReportType('balances');
                        setShowReportModal(true);
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Generate Report
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Overdue Payments</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Students with overdue payments</p>
                    <button 
                      onClick={() => {
                        setReportType('overdue');
                        setShowReportModal(true);
                      }}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">New Transaction</h3>
                <button
                  onClick={() => setShowNewTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student
                  </label>
                  <select
                    value={newTransactionForm.studentId}
                    onChange={(e) => setNewTransactionForm(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.grade} {student.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={newTransactionForm.type}
                    onChange={(e) => setNewTransactionForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="tuition">Tuition</option>
                    <option value="fees">Fees</option>
                    <option value="books">Books</option>
                    <option value="uniform">Uniform</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransactionForm.amount}
                    onChange={(e) => setNewTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newTransactionForm.description}
                    onChange={(e) => setNewTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Transaction description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={newTransactionForm.paymentMethod}
                    onChange={(e) => setNewTransactionForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewTransactionModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewTransaction}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Create</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {reportType === 'monthly' && 'Monthly Report'}
                  {reportType === 'balances' && 'Student Balances Report'}
                  {reportType === 'overdue' && 'Overdue Payments Report'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={printReport}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {reportType === 'monthly' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <option key={i} value={new Date().getFullYear() - 2 + i}>
                            {new Date().getFullYear() - 2 + i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const report = generateMonthlyReport();
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold text-blue-900">${report.totalRevenue.toFixed(2)}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-600 font-medium">Collected</p>
                            <p className="text-2xl font-bold text-green-900">${report.totalCollected.toFixed(2)}</p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-yellow-600 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">${report.totalPending.toFixed(2)}</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">Overdue</p>
                            <p className="text-2xl font-bold text-red-900">${report.totalOverdue.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Methods</h4>
                            <div className="space-y-2">
                              {Object.entries(report.paymentMethods).map(([method, amount]) => (
                                <div key={method} className="flex justify-between">
                                  <span className="text-gray-600">{method}</span>
                                  <span className="font-medium">${amount.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Fee Types</h4>
                            <div className="space-y-2">
                              {Object.entries(report.feeTypes).map(([type, amount]) => (
                                <div key={type} className="flex justify-between">
                                  <span className="text-gray-600 capitalize">{type}</span>
                                  <span className="font-medium">${amount.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {reportType === 'balances' && (
                <div className="space-y-4">
                  {(() => {
                    const balancesReport = getStudentBalancesReport();
                    return (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grade & Section
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Outstanding Balance
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {balancesReport.map((student) => (
                              <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                  {student.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.grade} - Section {student.section}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ${student.balance.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                    {getStatusIcon(student.status)}
                                    <span className="capitalize">{student.status}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div>
                                    <div>{student.email}</div>
                                    <div>{student.phone}</div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              )}

              {reportType === 'overdue' && (
                <div className="space-y-6">
                  {(() => {
                    const overdueReport = getOverduePaymentsReport();
                    return (
                      <div>
                        <div className="bg-red-50 p-4 rounded-lg mb-6">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-900">
                              {overdueReport.count} students with overdue payments totaling ${overdueReport.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Grade & Section
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Overdue Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Last Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Contact
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {overdueReport.students.map((student) => (
                                <tr key={student.id} className="bg-red-50">
                                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {student.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.grade} - Section {student.section}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                                    ${student.balance.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.lastPayment || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>
                                      <div>{student.email}</div>
                                      <div>{student.phone}</div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    let reportData;
                    let filename;
                    
                    if (reportType === 'monthly') {
                      reportData = generateMonthlyReport();
                      filename = `monthly_report_${reportData.month}_${reportData.year}`;
                    } else if (reportType === 'balances') {
                      reportData = getStudentBalancesReport();
                      filename = 'student_balances_report';
                    } else {
                      reportData = getOverduePaymentsReport();
                      filename = 'overdue_payments_report';
                    }
                    
                    exportReport(reportData, filename);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;