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
  RefreshCw,
  UserPlus,
  Mail,
  MessageSquare,
  Receipt,
  Send,
  Bell,
  GraduationCap,
  Phone,
  MapPin,
  User,
  BookOpen,
  X,
  Save
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
  parent_email: string;
  enrollment_date: string;
  status: 'active' | 'inactive';
  address: string;
  date_of_birth: string;
  emergency_contact: string;
  medical_notes: string;
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

interface EnrollmentForm {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  grade_level: string;
  section: string;
  address: string;
  parent_name: string;
  parent_email: string;
  parent_contact: string;
  emergency_contact: string;
  medical_notes: string;
  enrollment_fees: Array<{
    type: string;
    description: string;
    amount: number;
    due_date: string;
  }>;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'enrollment' | 'payment_due' | 'payment_received' | 'exam_reminder' | 'overdue';
  subject: string;
  email_content: string;
  sms_content: string;
  triggers: string[];
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
  
  // Enrollment Modal States
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentForm>({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    grade_level: '',
    section: '',
    address: '',
    parent_name: '',
    parent_email: '',
    parent_contact: '',
    emergency_contact: '',
    medical_notes: '',
    enrollment_fees: []
  });

  // Notification States
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  // Sample data for demonstration
  useEffect(() => {
    generateSampleData();
    generateNotificationTemplates();
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
        parent_email: 'jennifer.smith@email.com',
        enrollment_date: '2025-01-15',
        status: 'active',
        address: '123 Main Street, City, State 12345',
        date_of_birth: '2018-03-15',
        emergency_contact: '+1 (555) 456-7891',
        medical_notes: 'No known allergies'
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
        parent_email: 'jennifer.smith@email.com',
        enrollment_date: '2025-01-15',
        status: 'active',
        address: '123 Main Street, City, State 12345',
        date_of_birth: '2017-08-22',
        emergency_contact: '+1 (555) 456-7891',
        medical_notes: 'Asthma - inhaler required'
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
        parent_email: 'robert.johnson@email.com',
        enrollment_date: '2025-01-10',
        status: 'active',
        address: '456 Oak Avenue, City, State 12345',
        date_of_birth: '2016-11-08',
        emergency_contact: '+1 (555) 567-8902',
        medical_notes: 'Food allergy - nuts'
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
        parent_email: 'lisa.davis@email.com',
        enrollment_date: '2025-01-12',
        status: 'active',
        address: '789 Pine Street, City, State 12345',
        date_of_birth: '2015-05-30',
        emergency_contact: '+1 (555) 678-9013',
        medical_notes: 'Wears glasses'
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

  const generateNotificationTemplates = () => {
    const templates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Enrollment Confirmation',
        type: 'enrollment',
        subject: 'Welcome to Demo Elementary School!',
        email_content: `Dear {{parent_name}},

We are delighted to confirm that {{student_name}} has been successfully enrolled at Demo Elementary School for the {{school_year}} academic year.

Enrollment Details:
- Student: {{student_name}}
- Grade: {{grade_level}}
- Section: {{section}}
- Start Date: {{enrollment_date}}

Next Steps:
1. Complete payment of enrollment fees
2. Submit required documents
3. Attend orientation on {{orientation_date}}

If you have any questions, please contact our office at (555) 123-4567.

Welcome to our school family!

Best regards,
Demo Elementary School Administration`,
        sms_content: 'Welcome! {{student_name}} is enrolled in {{grade_level}}-{{section}}. Enrollment fees due by {{due_date}}. Questions? Call (555) 123-4567.',
        triggers: ['enrollment_completed']
      },
      {
        id: '2',
        name: 'Payment Due Reminder',
        type: 'payment_due',
        subject: 'Payment Reminder - {{fee_description}}',
        email_content: `Dear {{parent_name}},

This is a friendly reminder that a payment is due for {{student_name}}.

Payment Details:
- Description: {{fee_description}}
- Amount: {{amount}}
- Due Date: {{due_date}}
- Student: {{student_name}}

Please make your payment by the due date to avoid late fees. You can pay online through our parent portal or visit our office.

Thank you for your prompt attention to this matter.

Best regards,
Demo Elementary School Finance Office`,
        sms_content: 'Payment reminder: {{fee_description}} for {{student_name}} - ${{amount}} due {{due_date}}. Pay online or call (555) 123-4567.',
        triggers: ['payment_due_3_days', 'payment_due_1_day']
      },
      {
        id: '3',
        name: 'Payment Received',
        type: 'payment_received',
        subject: 'Payment Confirmation - {{fee_description}}',
        email_content: `Dear {{parent_name}},

Thank you! We have received your payment for {{student_name}}.

Payment Details:
- Description: {{fee_description}}
- Amount: {{amount}}
- Payment Date: {{payment_date}}
- Transaction ID: {{transaction_id}}
- Payment Method: {{payment_method}}

Your receipt is attached to this email. Please keep it for your records.

Thank you for your prompt payment.

Best regards,
Demo Elementary School Finance Office`,
        sms_content: 'Payment received! ${{amount}} for {{fee_description}} - {{student_name}}. Transaction: {{transaction_id}}. Receipt emailed.',
        triggers: ['payment_received']
      },
      {
        id: '4',
        name: 'Exam Fee Reminder',
        type: 'exam_reminder',
        subject: 'Upcoming Exam - Payment Required',
        email_content: `Dear {{parent_name}},

We hope this message finds you well. We wanted to inform you about an upcoming exam for {{student_name}} that requires a fee payment.

Exam Details:
- Exam: {{exam_name}}
- Date: {{exam_date}}
- Fee: {{exam_fee}}
- Payment Due: {{payment_due_date}}

This fee covers exam materials, processing, and certification. Please ensure payment is made by the due date so {{student_name}} can participate in the exam.

You can make payment through our online portal or visit our office during business hours.

Best regards,
Demo Elementary School Academic Office`,
        sms_content: 'Exam reminder: {{exam_name}} on {{exam_date}} for {{student_name}}. Fee ${{exam_fee}} due {{payment_due_date}}.',
        triggers: ['exam_scheduled', 'exam_fee_due']
      },
      {
        id: '5',
        name: 'Overdue Payment Notice',
        type: 'overdue',
        subject: 'URGENT: Overdue Payment - {{fee_description}}',
        email_content: `Dear {{parent_name}},

We notice that a payment for {{student_name}} is now overdue. Please address this matter immediately to avoid any disruption to your child's education.

Overdue Payment Details:
- Description: {{fee_description}}
- Amount: {{amount}}
- Original Due Date: {{due_date}}
- Days Overdue: {{days_overdue}}
- Late Fee: {{late_fee}}

Total Amount Due: {{total_due}}

Please contact our office immediately at (555) 123-4567 to arrange payment or discuss payment options.

Sincerely,
Demo Elementary School Finance Office`,
        sms_content: 'URGENT: {{fee_description}} for {{student_name}} is {{days_overdue}} days overdue. Total due: ${{total_due}}. Call (555) 123-4567 immediately.',
        triggers: ['payment_overdue_7_days', 'payment_overdue_14_days']
      }
    ];

    setNotificationTemplates(templates);
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

  // Enrollment Functions
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newStudent: Student = {
        id: (students.length + 1).toString(),
        ...enrollmentForm,
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      // Add student
      setStudents(prev => [...prev, newStudent]);

      // Add enrollment fees
      const newFees = enrollmentForm.enrollment_fees.map((fee, index) => ({
        id: (fees.length + index + 1).toString(),
        student_id: newStudent.id,
        student_name: `${newStudent.first_name} ${newStudent.last_name}`,
        fee_type: fee.type,
        description: fee.description,
        amount: fee.amount,
        due_date: fee.due_date,
        status: 'pending' as const
      }));

      setFees(prev => [...prev, ...newFees]);

      // Generate enrollment receipt
      generateEnrollmentReceipt(newStudent, newFees);

      // Send notifications (simulated)
      await sendEnrollmentNotifications(newStudent);

      // Reset form
      setEnrollmentForm({
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: '',
        grade_level: '',
        section: '',
        address: '',
        parent_name: '',
        parent_email: '',
        parent_contact: '',
        emergency_contact: '',
        medical_notes: '',
        enrollment_fees: []
      });

      setShowEnrollmentModal(false);
      alert('Student enrolled successfully! Receipt generated and notifications sent.');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Error enrolling student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addEnrollmentFee = () => {
    setEnrollmentForm(prev => ({
      ...prev,
      enrollment_fees: [
        ...prev.enrollment_fees,
        {
          type: 'Tuition',
          description: '',
          amount: 0,
          due_date: ''
        }
      ]
    }));
  };

  const removeEnrollmentFee = (index: number) => {
    setEnrollmentForm(prev => ({
      ...prev,
      enrollment_fees: prev.enrollment_fees.filter((_, i) => i !== index)
    }));
  };

  const updateEnrollmentFee = (index: number, field: string, value: any) => {
    setEnrollmentForm(prev => ({
      ...prev,
      enrollment_fees: prev.enrollment_fees.map((fee, i) => 
        i === index ? { ...fee, [field]: value } : fee
      )
    }));
  };

  // Receipt Generation
  const generateEnrollmentReceipt = (student: Student, fees: Fee[]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Demo Elementary School', 20, 20);
    doc.setFontSize(16);
    doc.text('Enrollment Receipt', 20, 35);
    
    // Receipt details
    doc.setFontSize(12);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Receipt #: ENR-${student.id}-${Date.now()}`, 20, 60);
    
    // Student information
    doc.setFontSize(14);
    doc.text('Student Information:', 20, 80);
    doc.setFontSize(12);
    doc.text(`Name: ${student.first_name} ${student.last_name}`, 20, 95);
    doc.text(`Grade: ${student.grade_level} - Section ${student.section}`, 20, 105);
    doc.text(`Enrollment Date: ${student.enrollment_date}`, 20, 115);
    
    // Parent information
    doc.setFontSize(14);
    doc.text('Parent/Guardian Information:', 20, 135);
    doc.setFontSize(12);
    doc.text(`Name: ${student.parent_name}`, 20, 150);
    doc.text(`Email: ${student.parent_email}`, 20, 160);
    doc.text(`Phone: ${student.parent_contact}`, 20, 170);
    
    // Fees table
    if (fees.length > 0) {
      const tableData = fees.map(fee => [
        fee.fee_type,
        fee.description,
        `$${fee.amount.toFixed(2)}`,
        fee.due_date,
        fee.status.toUpperCase()
      ]);
      
      (doc as any).autoTable({
        head: [['Fee Type', 'Description', 'Amount', 'Due Date', 'Status']],
        body: tableData,
        startY: 185,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }
    
    // Footer
    const finalY = (doc as any).lastAutoTable?.finalY || 200;
    doc.text('Thank you for choosing Demo Elementary School!', 20, finalY + 20);
    doc.text('For questions, contact us at (555) 123-4567', 20, finalY + 30);
    
    doc.save(`Enrollment_Receipt_${student.first_name}_${student.last_name}.pdf`);
  };

  const generatePaymentReceipt = (fee: Fee, student: Student) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Demo Elementary School', 20, 20);
    doc.setFontSize(16);
    doc.text('Payment Receipt', 20, 35);
    
    // Receipt details
    doc.setFontSize(12);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Transaction ID: ${fee.transaction_id || 'N/A'}`, 20, 60);
    
    // Student information
    doc.setFontSize(14);
    doc.text('Student Information:', 20, 80);
    doc.setFontSize(12);
    doc.text(`Name: ${student.first_name} ${student.last_name}`, 20, 95);
    doc.text(`Grade: ${student.grade_level} - Section ${student.section}`, 20, 105);
    
    // Payment details
    doc.setFontSize(14);
    doc.text('Payment Details:', 20, 125);
    doc.setFontSize(12);
    doc.text(`Description: ${fee.description}`, 20, 140);
    doc.text(`Amount: $${fee.amount.toFixed(2)}`, 20, 150);
    doc.text(`Payment Method: ${fee.payment_method || 'N/A'}`, 20, 160);
    doc.text(`Payment Date: ${fee.paid_date || 'N/A'}`, 20, 170);
    doc.text(`Status: ${fee.status.toUpperCase()}`, 20, 180);
    
    // Footer
    doc.text('Thank you for your payment!', 20, 200);
    doc.text('Keep this receipt for your records.', 20, 210);
    
    doc.save(`Payment_Receipt_${fee.transaction_id || fee.id}.pdf`);
  };

  // Notification Functions
  const sendEnrollmentNotifications = async (student: Student) => {
    // Simulate sending email
    console.log('📧 Sending enrollment confirmation email to:', student.parent_email);
    console.log('📱 Sending enrollment confirmation SMS to:', student.parent_contact);
    
    // In production, you would call your email/SMS APIs here
    // await emailService.send({
    //   to: student.parent_email,
    //   subject: 'Welcome to Demo Elementary School!',
    //   template: 'enrollment_confirmation',
    //   data: { student, enrollment_date: student.enrollment_date }
    // });
    
    // await smsService.send({
    //   to: student.parent_contact,
    //   message: `Welcome! ${student.first_name} is enrolled in ${student.grade_level}-${student.section}.`
    // });
    
    return true;
  };

  const sendPaymentNotifications = async (fee: Fee, student: Student, type: 'due' | 'received' | 'overdue') => {
    console.log(`📧 Sending ${type} notification email to:`, student.parent_email);
    console.log(`📱 Sending ${type} notification SMS to:`, student.parent_contact);
    
    // In production, implement actual notification sending
    return true;
  };

  const sendExamReminders = async (examDetails: any) => {
    console.log('📧 Sending exam reminder emails to all parents');
    console.log('📱 Sending exam reminder SMS to all parents');
    
    // In production, implement bulk notification sending
    return true;
  };

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
                <p className="text-sm text-gray-600">Financial Management & Student Enrollment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotificationModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notification Templates"
              >
                <Bell className="h-5 w-5" />
              </button>
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
              { id: 'enrollment', label: 'Student Enrollment', icon: UserPlus },
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

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowEnrollmentModal(true)}
                  className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <UserPlus className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">Enroll Student</span>
                </button>
                
                <button
                  onClick={() => sendExamReminders({ exam_name: 'Midterm Exams', exam_date: '2025-03-15' })}
                  className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Bell className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-900">Send Exam Reminders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('fees')}
                  className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Manage Fees</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('reports')}
                  className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FileText className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-purple-900">Generate Reports</span>
                </button>
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

        {/* Student Enrollment Tab */}
        {activeTab === 'enrollment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Student Enrollment</h2>
              <button
                onClick={() => setShowEnrollmentModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Enroll New Student</span>
              </button>
            </div>

            {/* Enrollment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                    <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                  </div>
                  <GraduationCap className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-green-600">
                      {students.filter(s => new Date(s.enrollment_date).getMonth() === new Date().getMonth()).length}
                    </p>
                  </div>
                  <Calendar className="h-12 w-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {students.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <Users className="h-12 w-12 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Enrollment Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Enrollment Process</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Required Information:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Student personal details</li>
                    <li>• Parent/Guardian information</li>
                    <li>• Emergency contact details</li>
                    <li>• Medical notes (if any)</li>
                    <li>• Grade level and section</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Automatic Actions:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• ✅ Enrollment receipt generation</li>
                    <li>• ✅ Welcome email to parents</li>
                    <li>• ✅ SMS confirmation</li>
                    <li>• ✅ Fee schedule creation</li>
                    <li>• ✅ Student record creation</li>
                  </ul>
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
                            <button
                              onClick={() => {
                                const studentFees = fees.filter(f => f.student_id === student.id && f.status === 'paid');
                                if (studentFees.length > 0) {
                                  generatePaymentReceipt(studentFees[0], student);
                                }
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Generate Receipt"
                            >
                              <Receipt className="h-4 w-4" />
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
                            <button
                              onClick={() => {
                                const student = students.find(s => s.id === fee.student_id);
                                if (student) {
                                  generatePaymentReceipt(fee, student);
                                }
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Generate Receipt"
                            >
                              <Receipt className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const student = students.find(s => s.id === fee.student_id);
                                if (student) {
                                  sendPaymentNotifications(fee, student, fee.status === 'overdue' ? 'overdue' : 'due');
                                }
                              }}
                              className="text-orange-600 hover:text-orange-900"
                              title="Send Notification"
                            >
                              <Send className="h-4 w-4" />
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

      {/* Student Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Enroll New Student</h3>
                <button
                  onClick={() => setShowEnrollmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEnrollStudent} className="space-y-6">
                {/* Student Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        required
                        value={enrollmentForm.first_name}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        value={enrollmentForm.last_name}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={enrollmentForm.email}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={enrollmentForm.date_of_birth}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                      <select
                        required
                        value={enrollmentForm.grade_level}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, grade_level: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Grade</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                      <select
                        required
                        value={enrollmentForm.section}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, section: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      required
                      value={enrollmentForm.address}
                      onChange={(e) => setEnrollmentForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Parent Information */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Parent/Guardian Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                      <input
                        type="text"
                        required
                        value={enrollmentForm.parent_name}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, parent_name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                      <input
                        type="email"
                        required
                        value={enrollmentForm.parent_email}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, parent_email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parent Contact</label>
                      <input
                        type="tel"
                        required
                        value={enrollmentForm.parent_contact}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, parent_contact: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                      <input
                        type="tel"
                        required
                        value={enrollmentForm.emergency_contact}
                        onChange={(e) => setEnrollmentForm(prev => ({ ...prev, emergency_contact: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                    <textarea
                      value={enrollmentForm.medical_notes}
                      onChange={(e) => setEnrollmentForm(prev => ({ ...prev, medical_notes: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Any allergies, medical conditions, or special needs..."
                    />
                  </div>
                </div>

                {/* Enrollment Fees */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-yellow-900">Enrollment Fees</h4>
                    <button
                      type="button"
                      onClick={addEnrollmentFee}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Fee</span>
                    </button>
                  </div>
                  
                  {enrollmentForm.enrollment_fees.map((fee, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-lg border border-yellow-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
                        <select
                          value={fee.type}
                          onChange={(e) => updateEnrollmentFee(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Tuition">Tuition</option>
                          <option value="Books">Books</option>
                          <option value="Miscellaneous">Miscellaneous</option>
                          <option value="School Trip">School Trip</option>
                          <option value="Uniform">Uniform</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          value={fee.description}
                          onChange={(e) => updateEnrollmentFee(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Fee description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={fee.amount}
                          onChange={(e) => updateEnrollmentFee(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                          <input
                            type="date"
                            value={fee.due_date}
                            onChange={(e) => updateEnrollmentFee(index, 'due_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEnrollmentFee(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {enrollmentForm.enrollment_fees.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No enrollment fees added. Click "Add Fee" to create fee schedules.
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEnrollmentModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Enrolling...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Enroll Student</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification Templates Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Notification Templates</h3>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          template.type === 'enrollment' ? 'bg-blue-100 text-blue-800' :
                          template.type === 'payment_due' ? 'bg-yellow-100 text-yellow-800' :
                          template.type === 'payment_received' ? 'bg-green-100 text-green-800' :
                          template.type === 'exam_reminder' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {template.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            console.log('Testing notification template:', template.name);
                            alert(`Test notification sent! (${template.name})`);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Email Template</span>
                        </h5>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Subject: {template.subject}</p>
                          <p className="text-xs text-gray-600 line-clamp-3">{template.email_content}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>SMS Template</span>
                        </h5>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600">{template.sms_content}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Triggers:</h5>
                      <div className="flex flex-wrap gap-2">
                        {template.triggers.map((trigger, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {trigger.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;