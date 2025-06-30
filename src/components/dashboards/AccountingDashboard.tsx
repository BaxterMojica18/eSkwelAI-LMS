import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertTriangle,
  Calendar,
  CreditCard,
  Printer,
  Save,
  RefreshCw,
  LogOut,
  Clock,
  Percent,
  Receipt,
  Target,
  PiggyBank,
  Banknote,
  Coins
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade_level: string;
  section: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  enrollment_date: string;
  balance: number;
}

interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  amount: number;
  payment_method: string;
  reference_number: string;
  receipt_number: string;
  description: string;
  payment_date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Fee {
  id: string;
  name: string;
  description: string;
  amount: number;
  category: string;
  grade_levels: string[];
  due_date: string;
  is_recurring: boolean;
  status: 'active' | 'inactive';
}

interface AdditionalFee {
  id: string;
  name: string;
  price: number;
}

interface AccountingDashboardProps {
  onSignOut: () => void;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);

  // Financial Calculator states
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState('none');
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeePrice, setNewFeePrice] = useState('');
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Late Fee Calculator states
  const [lateFeeStudent, setLateFeeStudent] = useState('');
  const [overdueDays, setOverdueDays] = useState('');
  const [lateFeeType, setLateFeeType] = useState('percentage'); // 'percentage' or 'flat'
  const [lateFeeRate, setLateFeeRate] = useState('5'); // 5% or flat amount
  const [lateFeeResult, setLateFeeResult] = useState<any>(null);

  // Payment Plan Generator states
  const [planStudent, setPlanStudent] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState('3');
  const [startDate, setStartDate] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<any>(null);

  // Refund Calculator states
  const [refundStudent, setRefundStudent] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [withdrawalDate, setWithdrawalDate] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('prorated'); // 'prorated', 'full', 'none'
  const [refundResult, setRefundResult] = useState<any>(null);

  // Form states
  const [enrollForm, setEnrollForm] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    grade_level: '',
    section: '',
    parent_name: '',
    parent_email: '',
    parent_phone: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    student_id: '',
    amount: '',
    payment_method: 'cash',
    description: '',
    reference_number: ''
  });

  const [feeForm, setFeeForm] = useState({
    name: '',
    description: '',
    amount: '',
    category: 'tuition',
    grade_levels: [] as string[],
    due_date: '',
    is_recurring: false
  });

  const gradeLevels = [
    'Nursery', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  const baseFees = {
    'Nursery': { tuition: 15000, books: 2000, lab: 500, activity: 1000 },
    'Kindergarten': { tuition: 18000, books: 2500, lab: 800, activity: 1200 },
    'Grade 1': { tuition: 20000, books: 3000, lab: 1000, activity: 1500 },
    'Grade 2': { tuition: 22000, books: 3200, lab: 1200, activity: 1600 },
    'Grade 3': { tuition: 24000, books: 3500, lab: 1400, activity: 1700 },
    'Grade 4': { tuition: 26000, books: 3800, lab: 1600, activity: 1800 },
    'Grade 5': { tuition: 28000, books: 4000, lab: 1800, activity: 1900 },
    'Grade 6': { tuition: 30000, books: 4200, lab: 2000, activity: 2000 },
    'Grade 7': { tuition: 32000, books: 4500, lab: 2200, activity: 2100 },
    'Grade 8': { tuition: 34000, books: 4800, lab: 2400, activity: 2200 },
    'Grade 9': { tuition: 36000, books: 5000, lab: 2600, activity: 2300 },
    'Grade 10': { tuition: 38000, books: 5200, lab: 2800, activity: 2400 },
    'Grade 11': { tuition: 40000, books: 5500, lab: 3000, activity: 2500 },
    'Grade 12': { tuition: 42000, books: 5800, lab: 3200, activity: 2600 }
  };

  const discounts = {
    'none': { name: 'No Discount', rate: 0 },
    'sibling': { name: 'Sibling Discount', rate: 0.10 },
    'early_bird': { name: 'Early Bird Discount', rate: 0.05 },
    'scholarship': { name: 'Scholarship', rate: 0.25 },
    'staff': { name: 'Staff Discount', rate: 0.20 }
  };

  useEffect(() => {
    generateSampleData();
  }, []);

  const generateSampleData = () => {
    // Sample students
    const sampleStudents: Student[] = [
      {
        id: '1',
        student_id: 'STU2025001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@email.com',
        grade_level: 'Grade 10',
        section: 'A',
        parent_name: 'Jane Doe',
        parent_email: 'jane.doe@email.com',
        parent_phone: '+1234567890',
        enrollment_date: '2025-01-15',
        balance: 15000
      },
      {
        id: '2',
        student_id: 'STU2025002',
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice.smith@email.com',
        grade_level: 'Grade 9',
        section: 'B',
        parent_name: 'Bob Smith',
        parent_email: 'bob.smith@email.com',
        parent_phone: '+1234567891',
        enrollment_date: '2025-01-16',
        balance: 8500
      }
    ];

    // Sample payments
    const samplePayments: Payment[] = [
      {
        id: '1',
        student_id: '1',
        student_name: 'John Doe',
        amount: 10000,
        payment_method: 'Bank Transfer',
        reference_number: 'REF001',
        receipt_number: 'REC001',
        description: 'Tuition Payment - Q1',
        payment_date: '2025-01-20',
        status: 'completed'
      }
    ];

    // Sample fees
    const sampleFees: Fee[] = [
      {
        id: '1',
        name: 'Tuition Fee',
        description: 'Quarterly tuition payment',
        amount: 25000,
        category: 'tuition',
        grade_levels: ['Grade 9', 'Grade 10'],
        due_date: '2025-02-15',
        is_recurring: true,
        status: 'active'
      }
    ];

    setStudents(sampleStudents);
    setPayments(samplePayments);
    setFees(sampleFees);
  };

  // Financial Calculator Functions
  const addAdditionalFee = () => {
    if (newFeeName.trim() && newFeePrice && !isNaN(Number(newFeePrice))) {
      const newFee: AdditionalFee = {
        id: Date.now().toString(),
        name: newFeeName.trim(),
        price: Number(newFeePrice)
      };
      setAdditionalFees([...additionalFees, newFee]);
      setNewFeeName('');
      setNewFeePrice('');
    }
  };

  const removeAdditionalFee = (id: string) => {
    setAdditionalFees(additionalFees.filter(fee => fee.id !== id));
  };

  const calculateFees = () => {
    if (!selectedGrade) return;

    const base = baseFees[selectedGrade as keyof typeof baseFees];
    const discount = discounts[selectedDiscount as keyof typeof discounts];
    
    const subtotal = base.tuition + base.books + base.lab + base.activity;
    const additionalTotal = additionalFees.reduce((sum, fee) => sum + fee.price, 0);
    const totalBeforeDiscount = subtotal + additionalTotal;
    const discountAmount = totalBeforeDiscount * discount.rate;
    const finalTotal = totalBeforeDiscount - discountAmount;

    const result = {
      grade: selectedGrade,
      baseFees: base,
      additionalFees: [...additionalFees],
      subtotal,
      additionalTotal,
      totalBeforeDiscount,
      discount: discount.name,
      discountRate: discount.rate,
      discountAmount,
      finalTotal,
      timestamp: new Date().toISOString()
    };

    setCalculationResult(result);
  };

  const exportCalculation = () => {
    if (!calculationResult) return;

    const csvContent = [
      ['Fee Calculator Results'],
      ['Grade Level', calculationResult.grade],
      [''],
      ['Base Fees'],
      ['Tuition', `₱${calculationResult.baseFees.tuition.toLocaleString()}`],
      ['Books', `₱${calculationResult.baseFees.books.toLocaleString()}`],
      ['Lab Fee', `₱${calculationResult.baseFees.lab.toLocaleString()}`],
      ['Activity Fee', `₱${calculationResult.baseFees.activity.toLocaleString()}`],
      [''],
      ['Additional Fees'],
      ...calculationResult.additionalFees.map((fee: AdditionalFee) => [fee.name, `₱${fee.price.toLocaleString()}`]),
      [''],
      ['Summary'],
      ['Subtotal (Base)', `₱${calculationResult.subtotal.toLocaleString()}`],
      ['Additional Fees Total', `₱${calculationResult.additionalTotal.toLocaleString()}`],
      ['Total Before Discount', `₱${calculationResult.totalBeforeDiscount.toLocaleString()}`],
      ['Discount Applied', calculationResult.discount],
      ['Discount Amount', `₱${calculationResult.discountAmount.toLocaleString()}`],
      ['Final Total', `₱${calculationResult.finalTotal.toLocaleString()}`],
      [''],
      ['Generated on', new Date().toLocaleString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee-calculation-${calculationResult.grade}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveCalculation = () => {
    if (!calculationResult) return;
    
    const saved = JSON.parse(localStorage.getItem('saved-calculations') || '[]');
    saved.unshift(calculationResult);
    localStorage.setItem('saved-calculations', JSON.stringify(saved.slice(0, 5)));
    alert('Calculation saved successfully!');
  };

  // Late Fee Calculator Functions
  const calculateLateFee = () => {
    if (!lateFeeStudent || !overdueDays || !lateFeeRate) return;

    const student = students.find(s => s.id === lateFeeStudent);
    if (!student) return;

    const days = parseInt(overdueDays);
    const rate = parseFloat(lateFeeRate);
    const originalAmount = student.balance;

    let lateFeeAmount = 0;
    if (lateFeeType === 'percentage') {
      // Percentage per day
      lateFeeAmount = originalAmount * (rate / 100) * days;
    } else {
      // Flat fee per day
      lateFeeAmount = rate * days;
    }

    const result = {
      student: student,
      originalAmount,
      overdueDays: days,
      lateFeeType,
      lateFeeRate: rate,
      lateFeeAmount,
      totalAmount: originalAmount + lateFeeAmount,
      timestamp: new Date().toISOString()
    };

    setLateFeeResult(result);
  };

  // Payment Plan Generator Functions
  const generatePaymentPlan = () => {
    if (!planStudent || !totalAmount || !installments || !startDate) return;

    const student = students.find(s => s.id === planStudent);
    if (!student) return;

    const amount = parseFloat(totalAmount);
    const numInstallments = parseInt(installments);
    const start = new Date(startDate);

    const installmentAmount = amount / numInstallments;
    const plan = [];

    for (let i = 0; i < numInstallments; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + i);
      
      plan.push({
        installment: i + 1,
        amount: i === numInstallments - 1 ? 
          amount - (installmentAmount * (numInstallments - 1)) : // Last installment gets remainder
          installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending'
      });
    }

    const result = {
      student,
      totalAmount: amount,
      numInstallments,
      installmentAmount,
      plan,
      timestamp: new Date().toISOString()
    };

    setPaymentPlan(result);
  };

  // Refund Calculator Functions
  const calculateRefund = () => {
    if (!refundStudent || !refundAmount || !withdrawalDate) return;

    const student = students.find(s => s.id === refundStudent);
    if (!student) return;

    const amount = parseFloat(refundAmount);
    const withdrawal = new Date(withdrawalDate);
    const enrollment = new Date(student.enrollment_date);
    
    // Calculate days since enrollment
    const daysSinceEnrollment = Math.floor((withdrawal.getTime() - enrollment.getTime()) / (1000 * 60 * 60 * 24));
    
    let refundAmount = 0;
    let refundPercentage = 0;

    switch (refundPolicy) {
      case 'full':
        refundAmount = amount;
        refundPercentage = 100;
        break;
      case 'none':
        refundAmount = 0;
        refundPercentage = 0;
        break;
      case 'prorated':
        // Prorated based on days (assuming 365 days academic year)
        if (daysSinceEnrollment <= 30) {
          refundPercentage = 90;
        } else if (daysSinceEnrollment <= 60) {
          refundPercentage = 75;
        } else if (daysSinceEnrollment <= 90) {
          refundPercentage = 50;
        } else if (daysSinceEnrollment <= 120) {
          refundPercentage = 25;
        } else {
          refundPercentage = 0;
        }
        refundAmount = amount * (refundPercentage / 100);
        break;
    }

    const result = {
      student,
      originalAmount: amount,
      withdrawalDate,
      daysSinceEnrollment,
      refundPolicy,
      refundPercentage,
      refundAmount,
      nonRefundableAmount: amount - refundAmount,
      timestamp: new Date().toISOString()
    };

    setRefundResult(result);
  };

  // Student Management Functions
  const handleEnrollStudent = () => {
    const newStudent: Student = {
      id: Date.now().toString(),
      student_id: enrollForm.student_id || `STU${Date.now()}`,
      first_name: enrollForm.first_name,
      last_name: enrollForm.last_name,
      email: enrollForm.email,
      grade_level: enrollForm.grade_level,
      section: enrollForm.section,
      parent_name: enrollForm.parent_name,
      parent_email: enrollForm.parent_email,
      parent_phone: enrollForm.parent_phone,
      enrollment_date: new Date().toISOString().split('T')[0],
      balance: 0
    };

    setStudents([...students, newStudent]);
    setShowEnrollModal(false);
    setEnrollForm({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      grade_level: '',
      section: '',
      parent_name: '',
      parent_email: '',
      parent_phone: ''
    });
  };

  // Payment Management Functions
  const handleAddPayment = () => {
    const student = students.find(s => s.id === paymentForm.student_id);
    if (!student) return;

    const newPayment: Payment = {
      id: Date.now().toString(),
      student_id: paymentForm.student_id,
      student_name: `${student.first_name} ${student.last_name}`,
      amount: parseFloat(paymentForm.amount),
      payment_method: paymentForm.payment_method,
      reference_number: paymentForm.reference_number || `REF${Date.now()}`,
      receipt_number: `REC${Date.now()}`,
      description: paymentForm.description,
      payment_date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setPayments([...payments, newPayment]);
    
    // Update student balance
    const updatedStudents = students.map(s => 
      s.id === paymentForm.student_id 
        ? { ...s, balance: Math.max(0, s.balance - parseFloat(paymentForm.amount)) }
        : s
    );
    setStudents(updatedStudents);

    setShowPaymentModal(false);
    setPaymentForm({
      student_id: '',
      amount: '',
      payment_method: 'cash',
      description: '',
      reference_number: ''
    });
  };

  // Fee Management Functions
  const handleCreateFee = () => {
    const newFee: Fee = {
      id: Date.now().toString(),
      name: feeForm.name,
      description: feeForm.description,
      amount: parseFloat(feeForm.amount),
      category: feeForm.category,
      grade_levels: feeForm.grade_levels,
      due_date: feeForm.due_date,
      is_recurring: feeForm.is_recurring,
      status: 'active'
    };

    setFees([...fees, newFee]);
    setShowFeeModal(false);
    setFeeForm({
      name: '',
      description: '',
      amount: '',
      category: 'tuition',
      grade_levels: [],
      due_date: '',
      is_recurring: false
    });
  };

  // Export Functions
  const exportPayments = () => {
    const csvContent = [
      ['Payment ID', 'Student Name', 'Amount', 'Payment Method', 'Reference', 'Receipt', 'Description', 'Date', 'Status'],
      ...payments.map(payment => [
        payment.id,
        payment.student_name,
        payment.amount,
        payment.payment_method,
        payment.reference_number,
        payment.receipt_number,
        payment.description,
        payment.payment_date,
        payment.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportReport = (reportType: string) => {
    let csvContent = '';
    
    switch (reportType) {
      case 'financial':
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalOutstanding = students.reduce((sum, s) => sum + s.balance, 0);
        
        csvContent = [
          ['Financial Summary Report'],
          ['Generated on', new Date().toLocaleString()],
          [''],
          ['Revenue Summary'],
          ['Total Payments Received', `₱${totalRevenue.toLocaleString()}`],
          ['Total Outstanding Balance', `₱${totalOutstanding.toLocaleString()}`],
          [''],
          ['Payment Details'],
          ['Date', 'Student', 'Amount', 'Method', 'Reference'],
          ...payments.map(p => [p.payment_date, p.student_name, `₱${p.amount.toLocaleString()}`, p.payment_method, p.reference_number])
        ].map(row => row.join(',')).join('\n');
        break;
        
      case 'student':
        csvContent = [
          ['Student Enrollment Report'],
          ['Generated on', new Date().toLocaleString()],
          [''],
          ['Student ID', 'Name', 'Grade', 'Section', 'Parent', 'Balance', 'Enrollment Date'],
          ...students.map(s => [s.student_id, `${s.first_name} ${s.last_name}`, s.grade_level, s.section, s.parent_name, `₱${s.balance.toLocaleString()}`, s.enrollment_date])
        ].map(row => row.join(',')).join('\n');
        break;
        
      case 'fee':
        csvContent = [
          ['Fee Structure Report'],
          ['Generated on', new Date().toLocaleString()],
          [''],
          ['Fee Name', 'Category', 'Amount', 'Grade Levels', 'Due Date', 'Status'],
          ...fees.map(f => [f.name, f.category, `₱${f.amount.toLocaleString()}`, f.grade_levels.join('; '), f.due_date, f.status])
        ].map(row => row.join(',')).join('\n');
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = (reportType: string) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);

    switch (reportType) {
      case 'financial':
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalOutstanding = students.reduce((sum, s) => sum + s.balance, 0);
        
        doc.text(`Total Revenue: ₱${totalRevenue.toLocaleString()}`, 20, 50);
        doc.text(`Outstanding Balance: ₱${totalOutstanding.toLocaleString()}`, 20, 65);
        
        const paymentData = payments.map(p => [
          p.payment_date,
          p.student_name,
          `₱${p.amount.toLocaleString()}`,
          p.payment_method,
          p.reference_number
        ]);
        
        (doc as any).autoTable({
          head: [['Date', 'Student', 'Amount', 'Method', 'Reference']],
          body: paymentData,
          startY: 80
        });
        break;
        
      case 'student':
        const studentData = students.map(s => [
          s.student_id,
          `${s.first_name} ${s.last_name}`,
          s.grade_level,
          s.section,
          `₱${s.balance.toLocaleString()}`
        ]);
        
        (doc as any).autoTable({
          head: [['Student ID', 'Name', 'Grade', 'Section', 'Balance']],
          body: studentData,
          startY: 50
        });
        break;
    }

    doc.save(`${reportType}-report-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Accounting Dashboard</h1>
                <p className="text-sm text-gray-600">Financial Management & Student Enrollment</p>
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
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'calculator', label: 'Fee Calculator', icon: Calculator },
              { id: 'late-fee', label: 'Late Fee Calculator', icon: Clock },
              { id: 'payment-plan', label: 'Payment Plan Generator', icon: Calendar },
              { id: 'refund', label: 'Refund Calculator', icon: Banknote },
              { id: 'students', label: 'Student Management', icon: Users },
              { id: 'payments', label: 'Payment Tracking', icon: CreditCard },
              { id: 'fees', label: 'Fee Management', icon: DollarSign },
              { id: 'reports', label: 'Reports & Analytics', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-700'
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
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₱{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                    <p className="text-3xl font-bold text-red-600">
                      ₱{students.reduce((sum, s) => sum + s.balance, 0).toLocaleString()}
                    </p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Fees</p>
                    <p className="text-3xl font-bold text-purple-600">{fees.filter(f => f.status === 'active').length}</p>
                  </div>
                  <FileText className="h-12 w-12 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{payment.student_name}</p>
                          <p className="text-sm text-gray-600">{payment.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">₱{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{payment.payment_date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Students with Outstanding Balance</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {students.filter(s => s.balance > 0).slice(0, 5).map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
                          <p className="text-sm text-gray-600">{student.grade_level} - {student.section}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">₱{student.balance.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{student.student_id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fee Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Fee Calculator</h2>
                <p className="text-gray-600">Calculate total fees for students including discounts and additional charges</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Grade Level</option>
                      {gradeLevels.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                    <select
                      value={selectedDiscount}
                      onChange={(e) => setSelectedDiscount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(discounts).map(([key, discount]) => (
                        <option key={key} value={key}>
                          {discount.name} {discount.rate > 0 && `(${(discount.rate * 100).toFixed(0)}% off)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Additional Fees Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Fees</label>
                    <div className="space-y-3">
                      {additionalFees.map((fee) => (
                        <div key={fee.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{fee.name}</span>
                          </div>
                          <div className="text-gray-600">₱{fee.price.toLocaleString()}</div>
                          <button
                            onClick={() => removeAdditionalFee(fee.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={newFeeName}
                          onChange={(e) => setNewFeeName(e.target.value)}
                          placeholder="Fee name (e.g., Uniform, Field Trip)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          value={newFeePrice}
                          onChange={(e) => setNewFeePrice(e.target.value)}
                          placeholder="Price"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={addAdditionalFee}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={calculateFees}
                    disabled={!selectedGrade}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate Total Fees
                  </button>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {calculationResult ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Calculation Results</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grade Level:</span>
                          <span className="font-medium">{calculationResult.grade}</span>
                        </div>
                        
                        <div className="border-t pt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Base Fees:</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tuition:</span>
                              <span>₱{calculationResult.baseFees.tuition.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Books:</span>
                              <span>₱{calculationResult.baseFees.books.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lab Fee:</span>
                              <span>₱{calculationResult.baseFees.lab.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Activity Fee:</span>
                              <span>₱{calculationResult.baseFees.activity.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {calculationResult.additionalFees.length > 0 && (
                          <div className="border-t pt-3">
                            <h4 className="font-medium text-gray-900 mb-2">Additional Fees:</h4>
                            <div className="space-y-1 text-sm">
                              {calculationResult.additionalFees.map((fee: AdditionalFee) => (
                                <div key={fee.id} className="flex justify-between">
                                  <span className="text-gray-600">{fee.name}:</span>
                                  <span>₱{fee.price.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>₱{calculationResult.totalBeforeDiscount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount ({calculationResult.discount}):</span>
                            <span className="text-red-600">-₱{calculationResult.discountAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total:</span>
                            <span className="text-blue-600">₱{calculationResult.finalTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <button
                          onClick={exportCalculation}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </button>
                        <button
                          onClick={saveCalculation}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a grade level and click calculate to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Late Fee Calculator Tab */}
        {activeTab === 'late-fee' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <Clock className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Late Fee Calculator</h2>
                <p className="text-gray-600">Calculate late fees for overdue payments based on your school's policy</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                    <select
                      value={lateFeeStudent}
                      onChange={(e) => setLateFeeStudent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Choose a student</option>
                      {students.filter(s => s.balance > 0).map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} - ₱{student.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Days Overdue</label>
                    <input
                      type="number"
                      value={overdueDays}
                      onChange={(e) => setOverdueDays(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter number of overdue days"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Type</label>
                    <select
                      value={lateFeeType}
                      onChange={(e) => setLateFeeType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="percentage">Percentage per day</option>
                      <option value="flat">Flat fee per day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {lateFeeType === 'percentage' ? 'Percentage Rate (% per day)' : 'Flat Fee (₱ per day)'}
                    </label>
                    <input
                      type="number"
                      value={lateFeeRate}
                      onChange={(e) => setLateFeeRate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={lateFeeType === 'percentage' ? 'e.g., 5 (for 5% per day)' : 'e.g., 100 (for ₱100 per day)'}
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <button
                    onClick={calculateLateFee}
                    disabled={!lateFeeStudent || !overdueDays || !lateFeeRate}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate Late Fee
                  </button>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {lateFeeResult ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Late Fee Calculation</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Student:</span>
                          <span className="font-medium">{lateFeeResult.student.first_name} {lateFeeResult.student.last_name}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Amount:</span>
                          <span>₱{lateFeeResult.originalAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Overdue:</span>
                          <span>{lateFeeResult.overdueDays} days</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Late Fee Rate:</span>
                          <span>
                            {lateFeeResult.lateFeeType === 'percentage' 
                              ? `${lateFeeResult.lateFeeRate}% per day`
                              : `₱${lateFeeResult.lateFeeRate} per day`
                            }
                          </span>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Late Fee Amount:</span>
                            <span className="text-red-600 font-medium">₱{lateFeeResult.lateFeeAmount.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span>Total Amount Due:</span>
                            <span className="text-orange-600">₱{lateFeeResult.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => {
                            const csvContent = [
                              ['Late Fee Calculation'],
                              ['Student', `${lateFeeResult.student.first_name} ${lateFeeResult.student.last_name}`],
                              ['Student ID', lateFeeResult.student.student_id],
                              ['Original Amount', `₱${lateFeeResult.originalAmount.toLocaleString()}`],
                              ['Days Overdue', lateFeeResult.overdueDays],
                              ['Late Fee Type', lateFeeResult.lateFeeType],
                              ['Late Fee Rate', lateFeeResult.lateFeeType === 'percentage' ? `${lateFeeResult.lateFeeRate}%` : `₱${lateFeeResult.lateFeeRate}`],
                              ['Late Fee Amount', `₱${lateFeeResult.lateFeeAmount.toLocaleString()}`],
                              ['Total Amount Due', `₱${lateFeeResult.totalAmount.toLocaleString()}`],
                              ['Generated on', new Date().toLocaleString()]
                            ].map(row => row.join(',')).join('\n');

                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `late-fee-calculation-${lateFeeResult.student.student_id}-${Date.now()}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Calculation</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Fill in the details and click calculate to see late fee results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Plan Generator Tab */}
        {activeTab === 'payment-plan' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Plan Generator</h2>
                <p className="text-gray-600">Create customized payment plans for students and families</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Generator Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                    <select
                      value={planStudent}
                      onChange={(e) => setPlanStudent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} - Balance: ₱{student.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter total amount to be paid"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Installments</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2">2 installments</option>
                      <option value="3">3 installments</option>
                      <option value="4">4 installments</option>
                      <option value="6">6 installments</option>
                      <option value="9">9 installments</option>
                      <option value="12">12 installments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Payment Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <button
                    onClick={generatePaymentPlan}
                    disabled={!planStudent || !totalAmount || !installments || !startDate}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Payment Plan
                  </button>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {paymentPlan ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Plan</h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Student:</span>
                          <span className="font-medium">{paymentPlan.student.first_name} {paymentPlan.student.last_name}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">₱{paymentPlan.totalAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number of Installments:</span>
                          <span>{paymentPlan.numInstallments}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Installment Schedule:</h4>
                        <div className="space-y-3">
                          {paymentPlan.plan.map((installment: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div>
                                <span className="font-medium">Installment {installment.installment}</span>
                                <p className="text-sm text-gray-600">Due: {new Date(installment.dueDate).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium text-blue-600">₱{installment.amount.toLocaleString()}</span>
                                <p className="text-sm text-gray-500">{installment.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => {
                            const csvContent = [
                              ['Payment Plan'],
                              ['Student', `${paymentPlan.student.first_name} ${paymentPlan.student.last_name}`],
                              ['Student ID', paymentPlan.student.student_id],
                              ['Total Amount', `₱${paymentPlan.totalAmount.toLocaleString()}`],
                              ['Number of Installments', paymentPlan.numInstallments],
                              [''],
                              ['Installment Schedule'],
                              ['Installment', 'Amount', 'Due Date', 'Status'],
                              ...paymentPlan.plan.map((inst: any) => [
                                `Installment ${inst.installment}`,
                                `₱${inst.amount.toLocaleString()}`,
                                new Date(inst.dueDate).toLocaleDateString(),
                                inst.status
                              ]),
                              [''],
                              ['Generated on', new Date().toLocaleString()]
                            ].map(row => row.join(',')).join('\n');

                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `payment-plan-${paymentPlan.student.student_id}-${Date.now()}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Payment Plan</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Fill in the details and click generate to create a payment plan</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refund Calculator Tab */}
        {activeTab === 'refund' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <Banknote className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Refund Calculator</h2>
                <p className="text-gray-600">Calculate refund amounts based on withdrawal date and school policy</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                    <select
                      value={refundStudent}
                      onChange={(e) => setRefundStudent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Choose a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} - Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter amount to be refunded"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Date</label>
                    <input
                      type="date"
                      value={withdrawalDate}
                      onChange={(e) => setWithdrawalDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy</label>
                    <select
                      value={refundPolicy}
                      onChange={(e) => setRefundPolicy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="prorated">Prorated Refund (Time-based)</option>
                      <option value="full">Full Refund</option>
                      <option value="none">No Refund</option>
                    </select>
                  </div>

                  {refundPolicy === 'prorated' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Prorated Refund Policy:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Within 30 days: 90% refund</li>
                        <li>• 31-60 days: 75% refund</li>
                        <li>• 61-90 days: 50% refund</li>
                        <li>• 91-120 days: 25% refund</li>
                        <li>• After 120 days: No refund</li>
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={calculateRefund}
                    disabled={!refundStudent || !refundAmount || !withdrawalDate}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate Refund
                  </button>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {refundResult ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Refund Calculation</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Student:</span>
                          <span className="font-medium">{refundResult.student.first_name} {refundResult.student.last_name}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Amount:</span>
                          <span>₱{refundResult.originalAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Enrollment Date:</span>
                          <span>{new Date(refundResult.student.enrollment_date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Withdrawal Date:</span>
                          <span>{new Date(refundResult.withdrawalDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Since Enrollment:</span>
                          <span>{refundResult.daysSinceEnrollment} days</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Refund Policy:</span>
                          <span className="capitalize">{refundResult.refundPolicy}</span>
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Refund Percentage:</span>
                            <span className="font-medium">{refundResult.refundPercentage}%</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Refund Amount:</span>
                            <span className="text-green-600 font-medium">₱{refundResult.refundAmount.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Non-refundable:</span>
                            <span className="text-red-600">₱{refundResult.nonRefundableAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => {
                            const csvContent = [
                              ['Refund Calculation'],
                              ['Student', `${refundResult.student.first_name} ${refundResult.student.last_name}`],
                              ['Student ID', refundResult.student.student_id],
                              ['Original Amount', `₱${refundResult.originalAmount.toLocaleString()}`],
                              ['Enrollment Date', new Date(refundResult.student.enrollment_date).toLocaleDateString()],
                              ['Withdrawal Date', new Date(refundResult.withdrawalDate).toLocaleDateString()],
                              ['Days Since Enrollment', refundResult.daysSinceEnrollment],
                              ['Refund Policy', refundResult.refundPolicy],
                              ['Refund Percentage', `${refundResult.refundPercentage}%`],
                              ['Refund Amount', `₱${refundResult.refundAmount.toLocaleString()}`],
                              ['Non-refundable Amount', `₱${refundResult.nonRefundableAmount.toLocaleString()}`],
                              ['Generated on', new Date().toLocaleString()]
                            ].map(row => row.join(',')).join('\n');

                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `refund-calculation-${refundResult.student.student_id}-${Date.now()}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Calculation</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Banknote className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Fill in the details and click calculate to see refund results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Management Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Enroll Student</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade & Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                            <div className="text-sm text-gray-500">{student.student_id}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.grade_level}</div>
                          <div className="text-sm text-gray-500">Section {student.section}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.parent_name}</div>
                          <div className="text-sm text-gray-500">{student.parent_email}</div>
                          <div className="text-sm text-gray-500">{student.parent_phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₱{student.balance.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(student.enrollment_date).toLocaleDateString()}
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

        {/* Payment Tracking Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment Tracking</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportPayments}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Payment</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.student_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₱{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.payment_method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{payment.reference_number}</div>
                          <div className="text-xs text-gray-500">{payment.receipt_number}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
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

        {/* Fee Management Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Fee Management</h2>
              <button
                onClick={() => setShowFeeModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Fee</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Levels</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{fee.name}</div>
                          <div className="text-sm text-gray-500">{fee.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fee.category === 'tuition' ? 'bg-blue-100 text-blue-800' :
                            fee.category === 'books' ? 'bg-green-100 text-green-800' :
                            fee.category === 'lab' ? 'bg-purple-100 text-purple-800' :
                            fee.category === 'activity' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {fee.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₱{fee.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {fee.grade_levels.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(fee.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            fee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {fee.status}
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

        {/* Reports & Analytics Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Financial Report</h3>
                </div>
                <p className="text-gray-600 mb-4">Comprehensive financial summary including revenue, outstanding balances, and payment trends.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportReport('financial')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => printReport('financial')}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Student Report</h3>
                </div>
                <p className="text-gray-600 mb-4">Detailed student enrollment data including demographics, balances, and enrollment status.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportReport('student')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => printReport('student')}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Fee Structure Report</h3>
                </div>
                <p className="text-gray-600 mb-4">Complete fee structure breakdown by category, grade level, and payment schedules.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportReport('fee')}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => printReport('fee')}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Enroll New Student</h2>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID (Optional)</label>
                  <input
                    type="text"
                    value={enrollForm.student_id}
                    onChange={(e) => setEnrollForm({...enrollForm, student_id: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.first_name}
                    onChange={(e) => setEnrollForm({...enrollForm, first_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.last_name}
                    onChange={(e) => setEnrollForm({...enrollForm, last_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({...enrollForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                  <select
                    required
                    value={enrollForm.grade_level}
                    onChange={(e) => setEnrollForm({...enrollForm, grade_level: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Grade Level</option>
                    {gradeLevels.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.section}
                    onChange={(e) => setEnrollForm({...enrollForm, section: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., A, B, C"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={enrollForm.parent_name}
                    onChange={(e) => setEnrollForm({...enrollForm, parent_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter parent/guardian name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email *</label>
                  <input
                    type="email"
                    required
                    value={enrollForm.parent_email}
                    onChange={(e) => setEnrollForm({...enrollForm, parent_email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter parent email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={enrollForm.parent_phone}
                    onChange={(e) => setEnrollForm({...enrollForm, parent_phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter parent phone number"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollStudent}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enroll Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Student *</label>
                  <select
                    required
                    value={paymentForm.student_id}
                    onChange={(e) => setPaymentForm({...paymentForm, student_id: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} - Balance: ₱{student.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payment amount"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                  <select
                    required
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({...paymentForm, payment_method: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="check">Check</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.reference_number}
                    onChange={(e) => setPaymentForm({...paymentForm, reference_number: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter payment description"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Fee Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Fee</h2>
                <button
                  onClick={() => setShowFeeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Name *</label>
                    <input
                      type="text"
                      required
                      value={feeForm.name}
                      onChange={(e) => setFeeForm({...feeForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter fee name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={feeForm.category}
                      onChange={(e) => setFeeForm({...feeForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="tuition">Tuition</option>
                      <option value="books">Books</option>
                      <option value="lab">Laboratory</option>
                      <option value="activity">Activity</option>
                      <option value="miscellaneous">Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                    <input
                      type="number"
                      required
                      value={feeForm.amount}
                      onChange={(e) => setFeeForm({...feeForm, amount: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter fee amount"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={feeForm.due_date}
                      onChange={(e) => setFeeForm({...feeForm, due_date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={feeForm.description}
                    onChange={(e) => setFeeForm({...feeForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter fee description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Grade Levels *</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                    {gradeLevels.map((grade) => (
                      <label key={grade} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={feeForm.grade_levels.includes(grade)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFeeForm({...feeForm, grade_levels: [...feeForm.grade_levels, grade]});
                            } else {
                              setFeeForm({...feeForm, grade_levels: feeForm.grade_levels.filter(g => g !== grade)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{grade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={feeForm.is_recurring}
                      onChange={(e) => setFeeForm({...feeForm, is_recurring: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">This is a recurring fee</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowFeeModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFee}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Fee
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