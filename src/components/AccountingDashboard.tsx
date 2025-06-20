import React, { useState, useEffect } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Banknote,
  Receipt,
  ArrowLeft,
  X,
  Printer,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  email: string;
  phone: string;
  balance: number;
  status: 'current' | 'overdue' | 'paid';
  lastPayment: string;
  totalPaid: number;
  totalDue: number;
}

interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

interface MonthlyReportData {
  month: string;
  year: string;
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  paymentMethods: { [key: string]: number };
  feeTypes: { [key: string]: number };
  transactionCount: number;
}

interface AccountingDashboardProps {
  onBack: () => void;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Sample data - in a real app, this would come from your database
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Smith',
      grade: 'Grade 10',
      section: 'A',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      balance: 1250.00,
      status: 'overdue',
      lastPayment: '2024-11-15',
      totalPaid: 2750.00,
      totalDue: 4000.00
    },
    {
      id: '2',
      name: 'Emma Johnson',
      grade: 'Grade 9',
      section: 'B',
      email: 'emma.johnson@email.com',
      phone: '+1 (555) 234-5678',
      balance: 0,
      status: 'paid',
      lastPayment: '2024-12-01',
      totalPaid: 3500.00,
      totalDue: 3500.00
    },
    {
      id: '3',
      name: 'Michael Brown',
      grade: 'Grade 11',
      section: 'A',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      balance: 500.00,
      status: 'current',
      lastPayment: '2024-12-10',
      totalPaid: 3000.00,
      totalDue: 3500.00
    },
    {
      id: '4',
      name: 'Sarah Davis',
      grade: 'Grade 8',
      section: 'C',
      email: 'sarah.davis@email.com',
      phone: '+1 (555) 456-7890',
      balance: 2100.00,
      status: 'overdue',
      lastPayment: '2024-10-20',
      totalPaid: 1400.00,
      totalDue: 3500.00
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      studentId: '2',
      studentName: 'Emma Johnson',
      type: 'Tuition',
      amount: 1500.00,
      description: 'Monthly tuition payment',
      date: '2024-12-01',
      paymentMethod: 'Credit Card',
      status: 'completed'
    },
    {
      id: '2',
      studentId: '3',
      studentName: 'Michael Brown',
      type: 'Books',
      amount: 250.00,
      description: 'Textbook purchase',
      date: '2024-12-10',
      paymentMethod: 'Cash',
      status: 'completed'
    },
    {
      id: '3',
      studentId: '1',
      studentName: 'John Smith',
      type: 'Fees',
      amount: 300.00,
      description: 'Laboratory fees',
      date: '2024-11-15',
      paymentMethod: 'Bank Transfer',
      status: 'completed'
    }
  ]);

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    studentId: '',
    type: 'Tuition',
    amount: '',
    description: '',
    paymentMethod: 'Cash'
  });

  // New student form state
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    section: '',
    email: '',
    phone: '',
    totalDue: ''
  });

  // Export functions
  const exportToPDF = (data: any[], title: string, columns: string[], filename: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Create table
    doc.autoTable({
      head: [columns],
      body: data,
      startY: 45,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    doc.save(`${filename}.pdf`);
  };

  const exportToCSV = (data: any[], columns: string[], filename: string) => {
    const csvContent = [
      columns.join(','),
      ...data.map(row => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = (title: string, content: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #3b82f6; color: white; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .header { margin-bottom: 20px; }
              .date { color: #666; font-size: 14px; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate monthly report data
  const generateMonthlyReport = (): MonthlyReportData => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() + 1 === selectedMonth && 
             transactionDate.getFullYear() === selectedYear;
    });

    const totalCollected = monthTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPending = monthTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOverdue = students
      .filter(s => s.status === 'overdue')
      .reduce((sum, s) => sum + s.balance, 0);

    const paymentMethods: { [key: string]: number } = {};
    const feeTypes: { [key: string]: number } = {};

    monthTransactions.forEach(t => {
      if (t.status === 'completed') {
        paymentMethods[t.paymentMethod] = (paymentMethods[t.paymentMethod] || 0) + t.amount;
        feeTypes[t.type] = (feeTypes[t.type] || 0) + t.amount;
      }
    });

    return {
      month: new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' }),
      year: selectedYear.toString(),
      totalRevenue: totalCollected + totalPending,
      totalCollected,
      totalPending,
      totalOverdue,
      paymentMethods,
      feeTypes,
      transactionCount: monthTransactions.length
    };
  };

  // Export monthly report
  const exportMonthlyReport = (format: 'pdf' | 'csv' | 'print') => {
    const report = generateMonthlyReport();
    const title = `Monthly Report - ${report.month} ${report.year}`;
    
    if (format === 'pdf') {
      const data = [
        ['Total Revenue', `$${report.totalRevenue.toFixed(2)}`],
        ['Total Collected', `$${report.totalCollected.toFixed(2)}`],
        ['Total Pending', `$${report.totalPending.toFixed(2)}`],
        ['Total Overdue', `$${report.totalOverdue.toFixed(2)}`],
        ['Transaction Count', report.transactionCount.toString()],
        ['', ''],
        ['Payment Methods', ''],
        ...Object.entries(report.paymentMethods).map(([method, amount]) => [method, `$${amount.toFixed(2)}`]),
        ['', ''],
        ['Fee Types', ''],
        ...Object.entries(report.feeTypes).map(([type, amount]) => [type, `$${amount.toFixed(2)}`])
      ];
      exportToPDF(data, title, ['Category', 'Amount'], `monthly-report-${report.month}-${report.year}`);
    } else if (format === 'csv') {
      const data = [
        ['Total Revenue', report.totalRevenue.toFixed(2)],
        ['Total Collected', report.totalCollected.toFixed(2)],
        ['Total Pending', report.totalPending.toFixed(2)],
        ['Total Overdue', report.totalOverdue.toFixed(2)],
        ['Transaction Count', report.transactionCount.toString()],
        ['', ''],
        ['Payment Methods', ''],
        ...Object.entries(report.paymentMethods).map(([method, amount]) => [method, amount.toFixed(2)]),
        ['', ''],
        ['Fee Types', ''],
        ...Object.entries(report.feeTypes).map(([type, amount]) => [type, amount.toFixed(2)])
      ];
      exportToCSV(data, ['Category', 'Amount'], `monthly-report-${report.month}-${report.year}`);
    } else if (format === 'print') {
      const content = `
        <table>
          <tr><th>Category</th><th>Amount</th></tr>
          <tr><td>Total Revenue</td><td>$${report.totalRevenue.toFixed(2)}</td></tr>
          <tr><td>Total Collected</td><td>$${report.totalCollected.toFixed(2)}</td></tr>
          <tr><td>Total Pending</td><td>$${report.totalPending.toFixed(2)}</td></tr>
          <tr><td>Total Overdue</td><td>$${report.totalOverdue.toFixed(2)}</td></tr>
          <tr><td>Transaction Count</td><td>${report.transactionCount}</td></tr>
          <tr><td colspan="2"><strong>Payment Methods</strong></td></tr>
          ${Object.entries(report.paymentMethods).map(([method, amount]) => 
            `<tr><td>${method}</td><td>$${amount.toFixed(2)}</td></tr>`
          ).join('')}
          <tr><td colspan="2"><strong>Fee Types</strong></td></tr>
          ${Object.entries(report.feeTypes).map(([type, amount]) => 
            `<tr><td>${type}</td><td>$${amount.toFixed(2)}</td></tr>`
          ).join('')}
        </table>
      `;
      printReport(title, content);
    }
  };

  // Export student balances
  const exportStudentBalances = (format: 'pdf' | 'csv' | 'print') => {
    const studentsWithBalance = students.filter(s => s.balance > 0);
    const title = 'Student Balances Report';
    
    if (format === 'pdf') {
      const data = studentsWithBalance.map(s => [
        s.name,
        `${s.grade} - ${s.section}`,
        s.email,
        s.phone,
        `$${s.balance.toFixed(2)}`,
        s.status.charAt(0).toUpperCase() + s.status.slice(1),
        s.lastPayment
      ]);
      exportToPDF(data, title, ['Name', 'Grade/Section', 'Email', 'Phone', 'Balance', 'Status', 'Last Payment'], 'student-balances');
    } else if (format === 'csv') {
      const data = studentsWithBalance.map(s => [
        s.name,
        `${s.grade} - ${s.section}`,
        s.email,
        s.phone,
        s.balance.toFixed(2),
        s.status,
        s.lastPayment
      ]);
      exportToCSV(data, ['Name', 'Grade/Section', 'Email', 'Phone', 'Balance', 'Status', 'Last Payment'], 'student-balances');
    } else if (format === 'print') {
      const content = `
        <table>
          <tr>
            <th>Name</th>
            <th>Grade/Section</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Last Payment</th>
          </tr>
          ${studentsWithBalance.map(s => `
            <tr>
              <td>${s.name}</td>
              <td>${s.grade} - ${s.section}</td>
              <td>${s.email}</td>
              <td>${s.phone}</td>
              <td>$${s.balance.toFixed(2)}</td>
              <td>${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</td>
              <td>${s.lastPayment}</td>
            </tr>
          `).join('')}
        </table>
      `;
      printReport(title, content);
    }
  };

  // Export overdue payments
  const exportOverduePayments = (format: 'pdf' | 'csv' | 'print') => {
    const overdueStudents = students.filter(s => s.status === 'overdue');
    const title = 'Overdue Payments Report';
    
    if (format === 'pdf') {
      const data = overdueStudents.map(s => [
        s.name,
        `${s.grade} - ${s.section}`,
        s.email,
        s.phone,
        `$${s.balance.toFixed(2)}`,
        s.lastPayment,
        Math.floor((new Date().getTime() - new Date(s.lastPayment).getTime()) / (1000 * 60 * 60 * 24)) + ' days'
      ]);
      exportToPDF(data, title, ['Name', 'Grade/Section', 'Email', 'Phone', 'Amount Overdue', 'Last Payment', 'Days Overdue'], 'overdue-payments');
    } else if (format === 'csv') {
      const data = overdueStudents.map(s => [
        s.name,
        `${s.grade} - ${s.section}`,
        s.email,
        s.phone,
        s.balance.toFixed(2),
        s.lastPayment,
        Math.floor((new Date().getTime() - new Date(s.lastPayment).getTime()) / (1000 * 60 * 60 * 24))
      ]);
      exportToCSV(data, ['Name', 'Grade/Section', 'Email', 'Phone', 'Amount Overdue', 'Last Payment', 'Days Overdue'], 'overdue-payments');
    } else if (format === 'print') {
      const content = `
        <table>
          <tr>
            <th>Name</th>
            <th>Grade/Section</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Amount Overdue</th>
            <th>Last Payment</th>
            <th>Days Overdue</th>
          </tr>
          ${overdueStudents.map(s => `
            <tr>
              <td>${s.name}</td>
              <td>${s.grade} - ${s.section}</td>
              <td>${s.email}</td>
              <td>${s.phone}</td>
              <td>$${s.balance.toFixed(2)}</td>
              <td>${s.lastPayment}</td>
              <td>${Math.floor((new Date().getTime() - new Date(s.lastPayment).getTime()) / (1000 * 60 * 60 * 24))} days</td>
            </tr>
          `).join('')}
        </table>
      `;
      printReport(title, content);
    }
  };

  // Export all transactions
  const exportAllTransactions = (format: 'pdf' | 'csv' | 'print') => {
    const title = 'All Transactions Report';
    
    if (format === 'pdf') {
      const data = transactions.map(t => [
        t.date,
        t.studentName,
        t.type,
        t.description,
        `$${t.amount.toFixed(2)}`,
        t.paymentMethod,
        t.status.charAt(0).toUpperCase() + t.status.slice(1)
      ]);
      exportToPDF(data, title, ['Date', 'Student', 'Type', 'Description', 'Amount', 'Payment Method', 'Status'], 'all-transactions');
    } else if (format === 'csv') {
      const data = transactions.map(t => [
        t.date,
        t.studentName,
        t.type,
        t.description,
        t.amount.toFixed(2),
        t.paymentMethod,
        t.status
      ]);
      exportToCSV(data, ['Date', 'Student', 'Type', 'Description', 'Amount', 'Payment Method', 'Status'], 'all-transactions');
    } else if (format === 'print') {
      const content = `
        <table>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
          ${transactions.map(t => `
            <tr>
              <td>${t.date}</td>
              <td>${t.studentName}</td>
              <td>${t.type}</td>
              <td>${t.description}</td>
              <td>$${t.amount.toFixed(2)}</td>
              <td>${t.paymentMethod}</td>
              <td>${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</td>
            </tr>
          `).join('')}
        </table>
      `;
      printReport(title, content);
    }
  };

  // Handle new transaction submission
  const handleNewTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find(s => s.id === newTransaction.studentId);
    if (!student) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      studentId: newTransaction.studentId,
      studentName: student.name,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newTransaction.paymentMethod,
      status: 'completed'
    };

    setTransactions(prev => [transaction, ...prev]);

    // Update student balance
    setStudents(prev => prev.map(s => 
      s.id === newTransaction.studentId 
        ? { 
            ...s, 
            balance: Math.max(0, s.balance - transaction.amount),
            totalPaid: s.totalPaid + transaction.amount,
            lastPayment: transaction.date,
            status: s.balance - transaction.amount <= 0 ? 'paid' : s.status
          }
        : s
    ));

    // Reset form
    setNewTransaction({
      studentId: '',
      type: 'Tuition',
      amount: '',
      description: '',
      paymentMethod: 'Cash'
    });

    setShowNewTransactionModal(false);
  };

  // Handle new student submission
  const handleNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      grade: newStudent.grade,
      section: newStudent.section,
      email: newStudent.email,
      phone: newStudent.phone,
      balance: parseFloat(newStudent.totalDue),
      status: 'current',
      lastPayment: 'Never',
      totalPaid: 0,
      totalDue: parseFloat(newStudent.totalDue)
    };

    setStudents(prev => [student, ...prev]);

    // Reset form
    setNewStudent({
      name: '',
      grade: '',
      section: '',
      email: '',
      phone: '',
      totalDue: ''
    });

    setShowStudentModal(false);
  };

  // Calculate overview statistics
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);
  const totalPending = students.reduce((sum, s) => sum + (s.status === 'current' ? s.balance : 0), 0);
  const totalOverdue = students.reduce((sum, s) => sum + (s.status === 'overdue' ? s.balance : 0), 0);
  const totalStudents = students.length;

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">School Accounting</h1>
                <p className="text-sm text-gray-600">Financial Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNewTransactionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>New Transaction</span>
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
              { id: 'students', label: 'Students', icon: Users },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'reports', label: 'Reports', icon: FileText }
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-3xl font-bold text-gray-900">${totalPending.toFixed(2)}</p>
                    <p className="text-sm text-yellow-600 mt-1">{students.filter(s => s.status === 'current').length} students</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                    <p className="text-3xl font-bold text-gray-900">${totalOverdue.toFixed(2)}</p>
                    <p className="text-sm text-red-600 mt-1">{students.filter(s => s.status === 'overdue').length} students</p>
                  </div>
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                    <p className="text-sm text-blue-600 mt-1">Active accounts</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <button
                onClick={() => setShowStudentModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Student</span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade/Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className={`hover:bg-gray-50 ${student.status === 'overdue' ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.grade} - {student.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${student.balance.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'paid' ? 'bg-green-100 text-green-800' :
                            student.status === 'current' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.lastPayment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingStudent(student);
                                setShowStudentModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
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

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                  <FileDown className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Export:</span>
                  <button
                    onClick={() => exportAllTransactions('pdf')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    PDF
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => exportAllTransactions('csv')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    CSV
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => exportAllTransactions('print')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Print
                  </button>
                </div>
                <button
                  onClick={() => setShowNewTransactionModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Transaction</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
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
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>

            {/* Monthly Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Report</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[2022, 2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                    <FileDown className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Export:</span>
                    <button
                      onClick={() => exportMonthlyReport('pdf')}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      PDF
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => exportMonthlyReport('csv')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      CSV
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => exportMonthlyReport('print')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {(() => {
                const report = generateMonthlyReport();
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800">Total Revenue</h4>
                      <p className="text-2xl font-bold text-blue-900">${report.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-green-800">Collected</h4>
                      <p className="text-2xl font-bold text-green-900">${report.totalCollected.toFixed(2)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-800">Pending</h4>
                      <p className="text-2xl font-bold text-yellow-900">${report.totalPending.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800">Overdue</h4>
                      <p className="text-2xl font-bold text-red-900">${report.totalOverdue.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Student Balances Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Balances</h3>
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                  <FileDown className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Export:</span>
                  <button
                    onClick={() => exportStudentBalances('pdf')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    PDF
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => exportStudentBalances('csv')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    CSV
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => exportStudentBalances('print')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Print
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Outstanding Balances Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-yellow-700">Students with Balance:</span>
                      <span className="ml-2 font-semibold">{students.filter(s => s.balance > 0).length}</span>
                    </div>
                    <div>
                      <span className="text-yellow-700">Total Outstanding:</span>
                      <span className="ml-2 font-semibold">${students.reduce((sum, s) => sum + s.balance, 0).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-yellow-700">Average Balance:</span>
                      <span className="ml-2 font-semibold">
                        ${(students.reduce((sum, s) => sum + s.balance, 0) / students.filter(s => s.balance > 0).length || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade/Section</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students
                        .filter(s => s.balance > 0)
                        .sort((a, b) => b.balance - a.balance)
                        .map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {student.grade} - {student.section}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.phone}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              ${student.balance.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.status === 'current' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Overdue Payments Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Overdue Payments</h3>
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                  <FileDown className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Export:</span>
                  <button
                    onClick={() => exportOverduePayments('pdf')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    PDF
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => exportOverduePayments('csv')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    CSV
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => exportOverduePayments('print')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Print
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Overdue Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-red-700">Overdue Students:</span>
                      <span className="ml-2 font-semibold">{students.filter(s => s.status === 'overdue').length}</span>
                    </div>
                    <div>
                      <span className="text-red-700">Total Overdue:</span>
                      <span className="ml-2 font-semibold">${totalOverdue.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-red-700">Requires Attention:</span>
                      <span className="ml-2 font-semibold text-red-600">Immediate</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade/Section</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Overdue</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students
                        .filter(s => s.status === 'overdue')
                        .map((student) => (
                          <tr key={student.id} className="bg-red-50 hover:bg-red-100">
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {student.grade} - {student.section}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.phone}</td>
                            <td className="px-4 py-3 text-sm font-medium text-red-600">
                              ${student.balance.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{student.lastPayment}</td>
                            <td className="px-4 py-3 text-sm text-red-600">
                              {Math.floor((new Date().getTime() - new Date(student.lastPayment).getTime()) / (1000 * 60 * 60 * 24))} days
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
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

              <form onSubmit={handleNewTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student
                  </label>
                  <select
                    required
                    value={newTransaction.studentId}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, studentId: e.target.value }))}
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
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Fees">Fees</option>
                    <option value="Books">Books</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Transaction description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={newTransaction.paymentMethod}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTransactionModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <button
                  onClick={() => {
                    setShowStudentModal(false);
                    setEditingStudent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleNewStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Student's full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      required
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Grade</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section
                    </label>
                    <select
                      required
                      value={newStudent.section}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, section: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="student@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount Due
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newStudent.totalDue}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, totalDue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStudentModal(false);
                      setEditingStudent(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;