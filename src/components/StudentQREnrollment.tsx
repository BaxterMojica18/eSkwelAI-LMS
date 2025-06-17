import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Users,
  Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface EnrollmentResult {
  success: boolean;
  error?: string;
  enrollment_id?: string;
  section_id?: string;
  log_id?: string;
}

interface SectionInfo {
  id: string;
  name: string;
  school_levels?: {
    name: string;
  };
  teacher_sections?: Array<{
    user_profiles?: {
      first_name: string;
      last_name: string;
    };
  }>;
}

const StudentQREnrollment: React.FC = () => {
  const { profile } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnrollmentResult | null>(null);
  const [sectionInfo, setSectionInfo] = useState<SectionInfo | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) {
      fetchMyEnrollments();
    }
  }, [profile?.id]);

  const fetchMyEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          sections (
            name,
            school_levels (
              name
            )
          )
        `)
        .eq('student_id', profile?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchSectionInfo = async (sectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select(`
          *,
          school_levels (
            name
          ),
          teacher_sections (
            user_profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('id', sectionId)
        .single();

      if (error) throw error;
      setSectionInfo(data);
    } catch (error) {
      console.error('Error fetching section info:', error);
    }
  };

  const enrollViaQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim() || !profile?.id) return;

    setLoading(true);
    setResult(null);
    setSectionInfo(null);

    try {
      // Extract QR code from URL if it's a full URL
      let qrCodeParam = qrCode.trim();
      if (qrCodeParam.includes('/enroll/')) {
        qrCodeParam = qrCodeParam.split('/enroll/')[1];
      }

      const { data, error } = await supabase.rpc('enroll_student_via_qr', {
        qr_code_param: qrCodeParam,
        student_id_param: profile.id
      });

      if (error) throw error;

      setResult(data);

      if (data.success && data.section_id) {
        await fetchSectionInfo(data.section_id);
        await fetchMyEnrollments();
        setQrCode(''); // Clear the input on success
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Failed to enroll via QR code'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (scannedCode: string) => {
    setQrCode(scannedCode);
    // Auto-submit if we have a valid QR code
    if (scannedCode.trim()) {
      // Trigger enrollment automatically
      setTimeout(() => {
        const form = document.getElementById('qr-enrollment-form') as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* QR Code Enrollment Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join a Class</h2>
          <p className="text-gray-600">
            Scan a QR code or enter the enrollment code provided by your teacher
          </p>
        </div>

        <form id="qr-enrollment-form" onSubmit={enrollViaQR} className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code or Enrollment Link
            </label>
            <div className="relative">
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Paste QR code or enrollment link here"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <QrCode className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can paste the full enrollment link or just the QR code
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !qrCode.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Enrolling...</span>
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5" />
                <span>Join Class</span>
              </>
            )}
          </button>
        </form>

        {/* Result Display */}
        {result && (
          <div className="max-w-md mx-auto mt-6">
            {result.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900">Successfully Enrolled!</h3>
                    <p className="text-green-700 text-sm">
                      You have been enrolled in the class.
                    </p>
                  </div>
                </div>

                {sectionInfo && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900 mb-2">Class Details:</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Level:</span> {sectionInfo.school_levels?.name}</p>
                      <p><span className="text-gray-600">Section:</span> {sectionInfo.name}</p>
                      {sectionInfo.teacher_sections && sectionInfo.teacher_sections.length > 0 && (
                        <p>
                          <span className="text-gray-600">Teacher:</span>{' '}
                          {sectionInfo.teacher_sections[0].user_profiles?.first_name}{' '}
                          {sectionInfo.teacher_sections[0].user_profiles?.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900">Enrollment Failed</h3>
                    <p className="text-red-700 text-sm">
                      {result.error || 'An error occurred during enrollment'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Enrollments */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">My Classes</h3>
        </div>

        {enrollments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    {enrollment.sections?.school_levels?.name}
                  </h4>
                  <p className="text-gray-600">{enrollment.sections?.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>School Year: {enrollment.school_year}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Classes Yet</h4>
            <p className="text-gray-600">
              Use the QR code scanner above to join your first class
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">How to Join a Class</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Ask your teacher for the QR code or enrollment link</li>
              <li>• Scan the QR code with your phone's camera or paste the link above</li>
              <li>• Click "Join Class" to enroll automatically</li>
              <li>• You'll see the class appear in your "My Classes" section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQREnrollment;