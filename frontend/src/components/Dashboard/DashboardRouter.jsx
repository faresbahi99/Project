import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import PendingApproval from './PendingApproval';

const DashboardRouter = () => {
  const { user, isAuthenticated, canAccessDashboard } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم لا يمكنه الوصول للداشبورد (طبيب غير معتمد)
  if (!canAccessDashboard()) {
    return <PendingApproval />;
  }

  // توجيه المستخدم بناءً على الدور
  if (user.isAdmin) {
    return <AdminDashboard />;
  }

  if (user.role === 'doctor') {
    return <DoctorDashboard />;
  }

  if (user.role === 'patient') {
    return <PatientDashboard />;
  }

  // الحالة الافتراضية
  return (
    <div className="container">
      <div className="dashboard-default">
        <h2>Welcome to MediChain</h2>
        <p>Your dashboard is being prepared...</p>
      </div>
    </div>
  );
};

export default DashboardRouter;