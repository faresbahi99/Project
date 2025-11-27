import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Dashboard.module.css';

const PendingApproval = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.pendingApproval}>
          <div className={styles.pendingContent}>
            <div className={styles.pendingIcon}>
              <i className="fas fa-clock"></i>
            </div>
            <h1>Registration Under Review</h1>
            <p>Your healthcare provider registration is being reviewed by our administration team.</p>
            
            <div className={styles.pendingDetails}>
              <div className={styles.detailCard}>
                <h3>Professional Information</h3>
                <p><strong>Name:</strong> Dr. {user?.firstName} {user?.lastName}</p>
                <p><strong>Specialization:</strong> {user?.specialization}</p>
                <p><strong>Hospital:</strong> {user?.hospital}</p>
                <p><strong>License:</strong> {user?.licenseNumber}</p>
              </div>
              
              <div className={styles.detailCard}>
                <h3>Approval Process</h3>
                <ul>
                  <li><i className="fas fa-check"></i> Registration Submitted</li>
                  <li><i className="fas fa-clock"></i> Under Administrative Review</li>
                  <li><i className="fas fa-clock"></i> Verification in Progress</li>
                  <li><i className="fas fa-clock"></i> Final Approval Pending</li>
                </ul>
              </div>
            </div>
            
            <div className={styles.expectedTimeline}>
              <h4>Expected Timeline</h4>
              <p>Approval process typically takes 24-48 hours. You will be notified once your account is activated.</p>
            </div>
            
            <div className={styles.pendingActions}>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                <i className="fas fa-sync-alt"></i>
                Check Status
              </button>
              <button className="btn btn-outline" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;