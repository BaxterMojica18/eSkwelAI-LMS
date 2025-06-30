import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DeveloperDashboard from './dashboards/DeveloperDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import AccountingDashboard from './dashboards/AccountingDashboard';
import ProfileCompletion from './ProfileCompletion';

const DashboardRouter: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  useEffect(() => {
    if (profile) {
      console.log('Profile loaded in DashboardRouter:', profile);
      
      // Check if profile needs completion
      const requiredFields = [
        profile.first_name,
        profile.last_name,
        profile.email,
        profile.phone,
        profile.date_of_birth,
        profile.address
      ];

      const missingFields = requiredFields.filter(field => !field || field.trim() === '').length;
      console.log('Missing fields count:', missingFields);
      
      // Show profile completion if more than 2 fields are missing
      if (missingFields > 2) {
        setShowProfileCompletion(true);
      }
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
  };

  const handleProfileCompletion = () => {
    setShowProfileCompletion(false);
    // Refresh the page to reload profile data
    window.location.reload();
  };

  const renderDashboard = () => {
    console.log('Rendering dashboard for role:', profile.role);
    
    switch (profile.role) {
      case 'developer':
        return <DeveloperDashboard onSignOut={handleSignOut} />;
      case 'admin':
        return <DeveloperDashboard onSignOut={handleSignOut} />; // Admin uses developer dashboard for now
      case 'teacher':
        return <TeacherDashboard onSignOut={handleSignOut} />;
      case 'student':
        return <StudentDashboard onSignOut={handleSignOut} />;
      case 'parent':
        return <ParentDashboard onSignOut={handleSignOut} />;
      case 'accounting':
        return <AccountingDashboard onSignOut={handleSignOut} />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6">Your role ({profile.role}) is not recognized in the system.</p>
              <button
                onClick={handleSignOut}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderDashboard()}
      
      {/* Profile Completion Modal */}
      <ProfileCompletion
        isOpen={showProfileCompletion}
        onClose={() => setShowProfileCompletion(false)}
        onComplete={handleProfileCompletion}
      />
    </>
  );
};

export default DashboardRouter;