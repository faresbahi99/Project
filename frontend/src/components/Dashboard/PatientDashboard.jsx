import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Dashboard.module.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // بيانات نموذجية للمريض
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      title: 'Annual Checkup 2024',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      type: 'General Examination',
      access: ['Dr. Sarah Johnson']
    },
    {
      id: 2,
      title: 'Blood Test Results',
      date: '2024-01-10',
      doctor: 'Dr. Mike Chen',
      type: 'Lab Results',
      access: ['Dr. Mike Chen', 'Dr. Sarah Johnson']
    }
  ]);

  const [accessRequests, setAccessRequests] = useState([
    {
      id: 1,
      doctor: 'Dr. Robert Davis',
      specialization: 'Cardiology',
      reason: 'Consultation for heart condition',
      date: '2024-01-20',
      status: 'pending'
    }
  ]);

  const handleGrantAccess = (requestId) => {
    setAccessRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: 'granted' } : req
      )
    );
  };

  const handleDenyAccess = (requestId) => {
    setAccessRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: 'denied' } : req
      )
    );
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* رأس لوحة التحكم */}
        <div className={styles.dashboardHeader}>
          <div className={styles.welcomeSection}>
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's your medical dashboard</p>
          </div>
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-file-medical"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{medicalRecords.length}</h3>
                <p>Medical Records</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-user-md"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>3</h3>
                <p>Authorized Doctors</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{accessRequests.filter(r => r.status === 'pending').length}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* تبويبات التنقل */}
        <div className={styles.dashboardTabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-home"></i>
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'records' ? styles.active : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <i className="fas fa-file-medical"></i>
            Medical Records
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'access' ? styles.active : ''}`}
            onClick={() => setActiveTab('access')}
          >
            <i className="fas fa-shield-alt"></i>
            Access Control
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
        </div>

        {/* محتوى التبويبات */}
        <div className={styles.dashboardContent}>
          {activeTab === 'overview' && (
            <div className={styles.tabContent}>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewCard}>
                  <h3>Recent Medical Records</h3>
                  <div className={styles.recordsList}>
                    {medicalRecords.slice(0, 3).map(record => (
                      <div key={record.id} className={styles.recordItem}>
                        <div className={styles.recordIcon}>
                          <i className="fas fa-file-medical-alt"></i>
                        </div>
                        <div className={styles.recordInfo}>
                          <h4>{record.title}</h4>
                          <p>By {record.doctor} • {record.date}</p>
                        </div>
                        <span className={styles.recordType}>{record.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.overviewCard}>
                  <h3>Pending Access Requests</h3>
                  {accessRequests.filter(r => r.status === 'pending').length > 0 ? (
                    <div className={styles.requestsList}>
                      {accessRequests.filter(r => r.status === 'pending').map(request => (
                        <div key={request.id} className={styles.requestItem}>
                          <div className={styles.requestInfo}>
                            <h4>{request.doctor}</h4>
                            <p>{request.specialization}</p>
                            <span className={styles.requestReason}>{request.reason}</span>
                          </div>
                          <div className={styles.requestActions}>
                            <button 
                              className={`btn btn-primary ${styles.smallBtn}`}
                              onClick={() => handleGrantAccess(request.id)}
                            >
                              Grant
                            </button>
                            <button 
                              className={`btn btn-outline ${styles.smallBtn}`}
                              onClick={() => handleDenyAccess(request.id)}
                            >
                              Deny
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noData}>No pending requests</p>
                  )}
                </div>

                <div className={styles.overviewCard}>
                  <h3>Quick Actions</h3>
                  <div className={styles.quickActions}>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-upload"></i>
                      Upload New Record
                    </button>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-share-alt"></i>
                      Share Medical History
                    </button>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-download"></i>
                      Export All Records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Medical Records</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-plus"></i>
                  Add New Record
                </button>
              </div>
              <div className={styles.recordsGrid}>
                {medicalRecords.map(record => (
                  <div key={record.id} className={styles.recordCard}>
                    <div className={styles.recordHeader}>
                      <h3>{record.title}</h3>
                      <span className={styles.recordBadge}>{record.type}</span>
                    </div>
                    <div className={styles.recordDetails}>
                      <p><strong>Doctor:</strong> {record.doctor}</p>
                      <p><strong>Date:</strong> {record.date}</p>
                      <p><strong>Access Granted to:</strong> {record.access.join(', ')}</p>
                    </div>
                    <div className={styles.recordActions}>
                      <button className={`btn btn-outline ${styles.smallBtn}`}>
                        <i className="fas fa-eye"></i>
                        View
                      </button>
                      <button className={`btn btn-outline ${styles.smallBtn}`}>
                        <i className="fas fa-share"></i>
                        Share
                      </button>
                      <button className={`btn btn-outline ${styles.smallBtn}`}>
                        <i className="fas fa-download"></i>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Access Control</h2>
                <p>Manage who can view your medical records</p>
              </div>
              
              <div className={styles.accessSection}>
                <h3>Pending Requests</h3>
                {accessRequests.filter(r => r.status === 'pending').length > 0 ? (
                  <div className={styles.requestsGrid}>
                    {accessRequests.filter(r => r.status === 'pending').map(request => (
                      <div key={request.id} className={styles.requestCard}>
                        <div className={styles.requestMain}>
                          <div className={styles.doctorInfo}>
                            <div className={styles.doctorAvatar}>
                              {request.doctor.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4>{request.doctor}</h4>
                              <p>{request.specialization}</p>
                            </div>
                          </div>
                          <div className={styles.requestDetails}>
                            <p><strong>Reason:</strong> {request.reason}</p>
                            <p><strong>Requested:</strong> {request.date}</p>
                          </div>
                        </div>
                        <div className={styles.requestActions}>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleGrantAccess(request.id)}
                          >
                            Grant Access
                          </button>
                          <button 
                            className="btn btn-outline"
                            onClick={() => handleDenyAccess(request.id)}
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No pending access requests</p>
                )}
              </div>

              <div className={styles.accessSection}>
                <h3>Authorized Healthcare Providers</h3>
                <div className={styles.authorizedList}>
                  <div className={styles.authorizedItem}>
                    <div className={styles.doctorInfo}>
                      <div className={styles.doctorAvatar}>SJ</div>
                      <div>
                        <h4>Dr. Sarah Johnson</h4>
                        <p>General Practitioner</p>
                      </div>
                    </div>
                    <div className={styles.accessInfo}>
                      <span>Full Access</span>
                      <button className="btn btn-outline small">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className={styles.tabContent}>
              <Profile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;