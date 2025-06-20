import React, { useState, useEffect } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Download,
  Printer,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  BarChart3,
  PieChart,
  LogOut,
  RefreshCw
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade_level: string;
  section: string;
  parent_name: string;
  parent_contact: string;
  enrollment_date: string;
  status: 'active' | 'inactive';
}

interface Fee {
  id: string;
  student_id: string;
  student_name: string;
  fee_type: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paid_date?: string;
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
}

interface Transaction {
  id: string;
  student_id: string;
  student_name: string;
  amount: number;
  type: 'payment' | 'refund' | 'adjustment';
  method: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface AccountingDashboardProps {
  onSignOut: () => void;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Sample data for demonstration
  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample students
    const sampleStudents: Student[] = [
      {
        id: '1',
        first_name: 'Emma',
        last_name: 'Smith',
        email: 'emma.smith@demoschool.edu',
        grade_level: 'Grade 1',
        section: 'A',
        parent_name: 'Jennifer Smith',
        parent_contact: '+1 (555) 456-7890',
        enrollment_date: '2025-01-15',
        status: 'active'
      },
      {
        id: '2',
        first_name: 'James',
        last_name: 'Smith',
        email: 'james.smith@demoschool.edu',
        grade_level: 'Grade 2',
        section: 'B',
        parent_name: 'Jennifer Smith',
        parent_contact: '+1 (555) 456-7890',
        enrollment_date: '2025-01-15',
        status: 'active'
      },
      {
        id: '3',
        first_name: 'Michael',
        last_name: 'Johnson',
        email: 'michael.johnson@demoschool.edu',
        grade_level: 'Grade 3',
        section: 'A',
        parent_name: 'Robert Johnson',
        parent_contact: '+1 (555) 567-8901',
        enrollment_date: '2025-01-10',
        status: 'active'
      },
      {
        id: '4',
        first_name: 'Sarah',
        last_name: 'Davis',
        email: 'sarah.davis@demoschool.edu',
        grade_level: 'Grade 4',
        section: 'B',
        parent_name: 'Lisa Davis',
        parent_contact: '+1 (555) 678-9012',
        enrollment_date: '2025-01-12',
        status: 'active'
      }
    ];

    // Sample fees
    const sampleFees: Fee[] = [
      {
        id: '1',
        student_id: '1',
        student_name: 'Emma Smith',
        fee_type: 'Tuition',
        description: 'First Quarter Tuition Fee',
        amount: 500.00,
        due_date: '2025-02-01',
        status: 'paid',
        paid_date: '2025-01-25',
        payment_method: 'Credit Card',
        transaction_id: 'TXN001',
        notes: 'Paid in full'
      },
      {
        id: '2',
        student_id: '1',
        student_name: 'Emma Smith',
        fee_type: 'Books',
        description: 'Mathematics Textbook',
        amount: 150.00,
        due_date: '2025-02-15',
        status: 'pending'
      },
      {
        id: '3',
        student_id: '2',
        student_name: 'James Smith',
        fee_type: 'Tuition',
        description: 'First Quarter Tuition Fee',
        amount: 500.00,
        due_date: '2025-02-01',
        status: 'paid',
        paid_date: '2025-01-28',
        payment_method: 'Bank Transfer',
        transaction_id: 'TXN002'
      },
      {
        id: '4',
        student_id: '2',
        student_name: 'James Smith',
        fee_type: 'School Trip',
        description: 'Science Museum Field Trip',
        amount: 75.00,
        due_date: '2025-01-20',
        status: 'overdue'
      },
      {
        id: '5',
        student_id: '3',
        student_name: 'Michael Johnson',
        fee_type: 'Miscellaneous',
        description: 'Art Supplies Fee',
        amount: 50.00,
        due_date: '2025-02-10',
        status: 'pending'
      },
      {
        id: '6',
        student_id: '4',
        student_name: 'Sarah Davis',
        fee_type: 'Prom',
        description: 'Year-end Graduation Ceremony',
        amount: 200.00,
        due_date: '2025-06-01',
        status: 'pending'
      }
    ];

    // Sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        student_id: '1',
        student_name: 'Emma Smith',
        amount: 500.00,
        type: 'payment',
        method: 'Credit Card',
        description: 'First Quarter Tuition Fee',
        date: '2025-01-25',
        status: 'completed',
        reference: 'TXN001'
      },
      {
        id: '2',
        student_id: '2',
        student_name: 'James Smith',
        amount: 500.00,
        type: 'payment',
        method: 'Bank Transfer',
        description: 'First Quarter Tuition Fee',
        date: '2025-01-28',
        status: 'completed',
        reference: 'TXN002'
      },
      {
        id: '3',
        student_id: '3',
        student_name: 'Michael Johnson',
        amount: 25.00,
        type: 'refund',
        method: 'Credit Card',
        description: 'Overpayment refund',
        date: '2025-01-20',
        status: 'completed',
        reference: 'REF001'
      }
    ];

    setStudents(sampleStudents);
    setFees(sampleFees);
    setTransactions(sampleTransactions);
  };

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    totalRevenue: fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0),
    pendingPayments: fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0),
    overduePayments: fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0),
    totalTransactions: transactions.length,
    monthlyRevenue: fees.filter(f => f.status === 'paid' && new Date(f.paid_date || '').getMonth() === new Date().getMonth()).reduce((sum, f) => sum + f.amount, 0)
  };

  // Filter functions
  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.fee_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const feeDate = new Date(fee.due_date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = feeDate >= startDate && feeDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = transactionDate >= startDate && transactionDate <= endDate;
    }
    
    return matchesSearch && matchesDate;
  });

  // Export functions
  const exportToPDF = (data: any[], title: string, columns: string[], dataKeys: string[]) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Add table
    (doc as any).autoTable({
      head: [columns],
      body: data.map(item => dataKeys.map(key => {
        if (key.includes('.')) {
          const keys = key.split('.');
          return keys.reduce((obj, k) => obj?.[k], item) || '';
        }
        return item[key] || '';
      })),
      startY: 45,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });
    
    doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = (data: any[], filename: string, columns: string[], dataKeys: string[]) => {
    const csvContent = [
      columns.join(','),
      ...data.map(item => 
        dataKeys.map(key => {
          let value = key.includes('.') 
            ? key.split('.').reduce((obj, k) => obj?.[k], item) 
            : item[key];
          
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printData = (data: any[], title: string, columns: string[], dataKeys: string[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const tableRows = data.map(item => 
      `<tr>${dataKeys.map(key => {
        const value = key.includes('.') 
          ? key.split('.').reduce((obj, k) => obj?.[k], item) 
          : item[key];
        return `<td style="padding: 8px; border: 1px solid #ddd;">${value || ''}</td>`;
      }).join('')}</tr>`
    ).join('');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #3b82f6; color: white; padding: 12px; border: 1px solid #ddd; }
            td { padding: 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9fafb; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>${columns.map(col => `<th>${col}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Accounting Dashboard</h1>
                <p className="text-sm text-gray-600">Financial Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => generateSampleData()}
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
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'fees', label: 'Fee Management', icon: DollarSign },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
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
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-3xl font-bold text-yellow-600">${stats.pendingPayments.toFixed(2)}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                    <p className="text-3xl font-bold text-red-600">${stats.overduePayments.toFixed(2)}</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{transaction.student_name}</h4>
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${transaction.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overdue Payments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Overdue Payments</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {fees.filter(f => f.status === 'overdue').map((fee) => (
                      <div key={fee.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <h4 className="font-medium text-gray-900">{fee.student_name}</h4>
                          <p className="text-sm text-gray-600">{fee.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">${fee.amount.toFixed(2)}</p>
                          <p className="text-sm text-red-500">Due: {new Date(fee.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {fees.filter(f => f.status === 'overdue').length === 0 && (
                      <div className="text-center py-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-gray-600">No overdue payments</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportToPDF(
                    students,
                    'Student List',
                    ['Name', 'Email', 'Grade', 'Section', 'Parent', 'Contact', 'Status'],
                    ['first_name', 'email', 'grade_level', 'section', 'parent_name', 'parent_contact', 'status']
                  )}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportToCSV(
                    students,
                    'Student_List',
                    ['Name', 'Email', 'Grade', 'Section', 'Parent', 'Contact', 'Status'],
                    ['first_name', 'email', 'grade_level', 'section', 'parent_name', 'parent_contact', 'status']
                  )}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => printData(
                    students,
                    'Student List',
                    ['Name', 'Email', 'Grade', 'Section', 'Parent', 'Contact', 'Status'],
                    ['first_name', 'email', 'grade_level', 'section', 'parent_name', 'parent_contact', 'status']
                  )}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade & Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.grade_level} - {student.section}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{student.parent_name}</div>
                            <div className="text-sm text-gray-500">{student.parent_contact}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(student.enrollment_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
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

        {/* Fee Management Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fee Management</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportToPDF(
                    filteredFees,
                    'Fee Management Report',
                    ['Student', 'Type', 'Description', 'Amount', 'Due Date', 'Status', 'Paid Date'],
                    ['student_name', 'fee_type', 'description', 'amount', 'due_date', 'status', 'paid_date']
                  )}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportToCSV(
                    filteredFees,
                    'Fee_Management_Report',
                    ['Student', 'Type', 'Description', 'Amount', 'Due Date', 'Status', 'Paid Date'],
                    ['student_name', 'fee_type', 'description', 'amount', 'due_date', 'status', 'paid_date']
                  )}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => printData(
                    filteredFees,
                    'Fee Management Report',
                    ['Student', 'Type', 'Description', 'Amount', 'Due Date', 'Status', 'Paid Date'],
                    ['student_name', 'fee_type', 'description', 'amount', 'due_date', 'status', 'paid_date']
                  )}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
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
                      placeholder="Search fees..."
                    />
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Fee Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fee Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{fee.student_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{fee.fee_type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{fee.description}</div>
                          {fee.notes && (
                            <div className="text-sm text-gray-500">{fee.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${fee.amount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(fee.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                            {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
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

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportToPDF(
                    filteredTransactions,
                    'Transaction History',
                    ['Student', 'Amount', 'Type', 'Method', 'Description', 'Date', 'Status', 'Reference'],
                    ['student_name', 'amount', 'type', 'method', 'description', 'date', 'status', 'reference']
                  )}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportToCSV(
                    filteredTransactions,
                    'Transaction_History',
                    ['Student', 'Amount', 'Type', 'Method', 'Description', 'Date', 'Status', 'Reference'],
                    ['student_name', 'amount', 'type', 'method', 'description', 'date', 'status', 'reference']
                  )}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => printData(
                    filteredTransactions,
                    'Transaction History',
                    ['Student', 'Amount', 'Type', 'Method', 'Description', 'Date', 'Status', 'Reference'],
                    ['student_name', 'amount', 'type', 'method', 'description', 'date', 'status', 'reference']
                  )}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{transaction.student_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.type === 'payment' ? 'text-green-600' : 
                            transaction.type === 'refund' ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {transaction.type === 'refund' ? '-' : ''}${transaction.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'payment' ? 'bg-green-100 text-green-800' :
                            transaction.type === 'refund' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.method}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{transaction.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.reference}
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Monthly Report */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Report</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="font-medium text-green-600">${stats.monthlyRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium text-yellow-600">${stats.pendingPayments.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overdue:</span>
                    <span className="font-medium text-red-600">${stats.overduePayments.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => exportToPDF(
                      fees.filter(f => new Date(f.paid_date || '').getMonth() === new Date().getMonth()),
                      'Monthly Financial Report',
                      ['Student', 'Type', 'Amount', 'Status', 'Date'],
                      ['student_name', 'fee_type', 'amount', 'status', 'paid_date']
                    )}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Student Balances */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Balances</h3>
                <div className="space-y-3">
                  {students.slice(0, 3).map((student) => {
                    const studentFees = fees.filter(f => f.student_id === student.id);
                    const balance = studentFees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);
                    return (
                      <div key={student.id} className="flex justify-between">
                        <span className="text-gray-600">{student.first_name} {student.last_name}:</span>
                        <span className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${balance.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      const balanceData = students.map(student => {
                        const studentFees = fees.filter(f => f.student_id === student.id);
                        const balance = studentFees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);
                        return {
                          student_name: `${student.first_name} ${student.last_name}`,
                          balance: balance.toFixed(2),
                          grade: student.grade_level,
                          section: student.section
                        };
                      });
                      exportToPDF(
                        balanceData,
                        'Student Balances Report',
                        ['Student', 'Balance', 'Grade', 'Section'],
                        ['student_name', 'balance', 'grade', 'section']
                      );
                    }}
                    className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export Balances
                  </button>
                </div>
              </div>

              {/* Overdue Payments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Payments</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Overdue:</span>
                    <span className="font-medium text-red-600">${stats.overduePayments.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Count:</span>
                    <span className="font-medium text-gray-900">{fees.filter(f => f.status === 'overdue').length}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => exportToPDF(
                      fees.filter(f => f.status === 'overdue'),
                      'Overdue Payments Report',
                      ['Student', 'Type', 'Amount', 'Due Date', 'Days Overdue'],
                      ['student_name', 'fee_type', 'amount', 'due_date', 'days_overdue']
                    )}
                    className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Export Overdue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingDashboard;