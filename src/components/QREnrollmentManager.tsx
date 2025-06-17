import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Download,
  Calendar,
  Users,
  Settings,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface QRCode {
  id: string;
  section_id: string;
  school_year: string;
  qr_code: string;
  title: string;
  description: string | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  sections?: {
    name: string;
    school_levels?: {
      name: string;
    };
  };
}

interface QRLog {
  id: string;
  student_id: string;
  scanned_at: string;
  success: boolean;
  error_message: string | null;
  user_profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Section {
  id: string;
  name: string;
  school_levels?: {
    name: string;
  };
}

const QREnrollmentManager: React.FC = () => {
  const { profile } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [qrLogs, setQrLogs] = useState<QRLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [currentSchoolYear] = useState(new Date().getFullYear().toString());

  // Form state
  const [formData, setFormData] = useState({
    section_id: '',
    title: '',
    description: '',
    max_uses: '',
    expires_at: ''
  });

  useEffect(() => {
    if (profile?.id) {
      fetchQRCodes();
      fetchSections();
    }
  }, [profile?.id]);

  const fetchSections = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollment_qr_codes')
        .select(`
          *,
          sections (
            name,
            school_levels (
              name
            )
          )
        `)
        .eq('teacher_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQrCodes(data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQRLogs = async (qrCodeId: string) => {
    try {
      const { data, error } = await supabase
        .from('qr_enrollment_logs')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            email
          )
        `)
        .eq('qr_code_id', qrCodeId)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      setQrLogs(data || []);
    } catch (error) {
      console.error('Error fetching QR logs:', error);
    }
  };

  const createQRCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.rpc('generate_qr_code');
      if (error) throw error;

      const qrCodeData = {
        teacher_id: profile?.id,
        section_id: formData.section_id,
        school_year: currentSchoolYear,
        qr_code: data,
        title: formData.title,
        description: formData.description || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: formData.expires_at || null
      };

      const { error: insertError } = await supabase
        .from('enrollment_qr_codes')
        .insert(qrCodeData);

      if (insertError) throw insertError;

      setShowCreateModal(false);
      setFormData({
        section_id: '',
        title: '',
        description: '',
        max_uses: '',
        expires_at: ''
      });
      fetchQRCodes();
    } catch (error) {
      console.error('Error creating QR code:', error);
    }
  };

  const toggleQRStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('enrollment_qr_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchQRCodes();
    } catch (error) {
      console.error('Error updating QR status:', error);
    }
  };

  const deleteQRCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollment_qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const copyQRCode = (qrCode: string) => {
    const enrollmentUrl = `${window.location.origin}/enroll/${qrCode}`;
    navigator.clipboard.writeText(enrollmentUrl);
    // You could add a toast notification here
  };

  const downloadQRCode = (qrCode: QRCode) => {
    // Generate QR code image using a QR code library or API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/enroll/${qrCode.qr_code}`)}`;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${qrCode.title.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (qrCode: QRCode) => {
    if (!qrCode.is_active) return 'text-gray-500';
    if (qrCode.expires_at && new Date(qrCode.expires_at) < new Date()) return 'text-red-500';
    if (qrCode.max_uses && qrCode.current_uses >= qrCode.max_uses) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusText = (qrCode: QRCode) => {
    if (!qrCode.is_active) return 'Inactive';
    if (qrCode.expires_at && new Date(qrCode.expires_at) < new Date()) return 'Expired';
    if (qrCode.max_uses && qrCode.current_uses >= qrCode.max_uses) return 'Limit Reached';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Enrollment</h2>
          <p className="text-gray-600">Generate QR codes for students to join your classes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create QR Code</span>
        </button>
      </div>

      {/* QR Codes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qrCode) => (
          <div key={qrCode.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* QR Code Image */}
            <div className="flex justify-center mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/enroll/${qrCode.qr_code}`)}`}
                alt="QR Code"
                className="rounded-lg border"
              />
            </div>

            {/* QR Code Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">{qrCode.title}</h3>
                <p className="text-sm text-gray-600">
                  {qrCode.sections?.school_levels?.name} - {qrCode.sections?.name}
                </p>
                {qrCode.description && (
                  <p className="text-sm text-gray-500 mt-1">{qrCode.description}</p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(qrCode).replace('text-', 'bg-')}`}></div>
                <span className={`text-sm font-medium ${getStatusColor(qrCode)}`}>
                  {getStatusText(qrCode)}
                </span>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Uses:</span>
                  <span className="ml-1 font-medium">
                    {qrCode.current_uses}
                    {qrCode.max_uses && ` / ${qrCode.max_uses}`}
                  </span>
                </div>
                {qrCode.expires_at && (
                  <div>
                    <span className="text-gray-500">Expires:</span>
                    <span className="ml-1 font-medium">
                      {new Date(qrCode.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyQRCode(qrCode.qr_code)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy enrollment link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => downloadQRCode(qrCode)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download QR code"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQR(qrCode);
                      fetchQRLogs(qrCode.id);
                      setShowLogsModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="View enrollment logs"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleQRStatus(qrCode.id, qrCode.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      qrCode.is_active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={qrCode.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {qrCode.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => deleteQRCode(qrCode.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete QR code"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
          <p className="text-gray-600 mb-4">Create your first QR code to start enrolling students</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create QR Code
          </button>
        </div>
      )}

      {/* Create QR Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create QR Code</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={createQRCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    required
                    value={formData.section_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, section_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.school_levels?.name} - {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Math Class Enrollment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional information about this enrollment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Uses (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create QR Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Enrollment Logs</h3>
                  <p className="text-gray-600">{selectedQR.title}</p>
                </div>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {qrLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {log.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.user_profiles?.first_name} {log.user_profiles?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{log.user_profiles?.email}</p>
                        {log.error_message && (
                          <p className="text-sm text-red-600">{log.error_message}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(log.scanned_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(log.scanned_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {qrLogs.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No enrollment activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QREnrollmentManager;