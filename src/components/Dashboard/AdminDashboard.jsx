import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [pendingDoctors, setPendingDoctors] = useState([]);

  useEffect(() => {
    // بيانات وهمية للأدمن
    setUsers([
      { id: 1, name: 'John Smith', role: 'patient', status: 'active', joinDate: '2024-01-15' },
      { id: 2, name: 'Dr. Sarah Johnson', role: 'doctor', status: 'active', joinDate: '2024-01-10' },
      { id: 3, name: 'Maria Garcia', role: 'patient', status: 'inactive', joinDate: '2024-01-08' }
    ]);

    setStats({
      totalUsers: 1542,
      activePatients: 1247,
      activeDoctors: 295,
      totalRecords: 8456,
      pendingApprovals: 12,
      systemHealth: 'Excellent'
    });
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* رأس لوحة التحكم */}
        <div className={styles.dashboardHeader}>
          <div className={styles.welcomeSection}>
            <h1>Admin Dashboard</h1>
            <p>System Administration & Management</p>
            <div className={styles.adminBadge}>
              <i className="fas fa-shield-alt"></i>
              System Administrator
            </div>
          </div>
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-users"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-user-injured"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.activePatients}</h3>
                <p>Patients</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-user-md"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.activeDoctors}</h3>
                <p>Doctors</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-file-medical"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.totalRecords}</h3>
                <p>Medical Records</p>
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
            <i className="fas fa-tachometer-alt"></i>
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users-cog"></i>
            User Management
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'doctors' ? styles.active : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <i className="fas fa-user-md"></i>
            Doctor Approvals
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-bar"></i>
            Analytics
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'system' ? styles.active : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <i className="fas fa-cog"></i>
            System Settings
          </button>
        </div>

        {/* محتوى التبويبات */}
        <div className={styles.dashboardContent}>
          {activeTab === 'overview' && (
            <div className={styles.tabContent}>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewCard}>
                  <h3>System Health</h3>
                  <div className={styles.healthStatus}>
                    <div className={`${styles.statusIndicator} ${styles.excellent}`}></div>
                    <span>All Systems Operational</span>
                  </div>
                  <div className={styles.systemMetrics}>
                    <div className={styles.metric}>
                      <span>Server Uptime</span>
                      <strong>99.98%</strong>
                    </div>
                    <div className={styles.metric}>
                      <span>Response Time</span>
                      <strong>124ms</strong>
                    </div>
                    <div className={styles.metric}>
                      <span>Active Sessions</span>
                      <strong>247</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.overviewCard}>
                  <h3>Recent Activity</h3>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <i className="fas fa-user-plus"></i>
                      <div>
                        <p>New patient registration</p>
                        <small>2 minutes ago</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <i className="fas fa-file-medical"></i>
                      <div>
                        <p>Medical record updated</p>
                        <small>15 minutes ago</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <i className="fas fa-shield-alt"></i>
                      <div>
                        <p>Security audit completed</p>
                        <small>1 hour ago</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.overviewCard}>
                  <h3>Quick Actions</h3>
                  <div className={styles.quickActions}>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-user-plus"></i>
                      Add New User
                    </button>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-chart-line"></i>
                      View Reports
                    </button>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-cog"></i>
                      System Settings
                    </button>
                    <button className={styles.actionBtn}>
                      <i className="fas fa-download"></i>
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>User Management</h2>
                <button className="btn btn-primary">
                  <i className="fas fa-plus"></i>
                  Add User
                </button>
              </div>
              
              <div className={styles.usersTable}>
                <div className={styles.tableHeader}>
                  <span>User</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Join Date</span>
                  <span>Actions</span>
                </div>
                {users.map(user => (
                  <div key={user.id} className={styles.tableRow}>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{user.name}</span>
                    </div>
                    <div className={styles.roleCell}>
                      <span className={`${styles.roleBadge} ${user.role === 'doctor' ? styles.doctorBadge : styles.patientBadge}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.active : styles.inactive}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className={styles.dateCell}>{user.joinDate}</div>
                    <div className={styles.actionsCell}>
                      <button className={`btn btn-outline ${styles.smallBtn}`}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className={`btn btn-outline ${styles.smallBtn}`}>
                        <i className={`fas fa-${user.status === 'active' ? 'pause' : 'play'}`}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'doctors' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>Doctor Registration Approvals</h2>
                <p>Review and approve healthcare provider registrations</p>
              </div>
              
              <div className={styles.pendingDoctors}>
                <h3>Pending Approvals ({pendingDoctors.length})</h3>
                
                {pendingDoctors.length > 0 ? (
                  <div className={styles.doctorsGrid}>
                    {pendingDoctors.map((doctor, index) => (
                      <div key={index} className={styles.doctorCard}>
                        <div className={styles.doctorHeader}>
                          <img 
                            src={doctor.avatar || 'https://ui-avatars.com/api/?name=Doctor&background=2E86AB&color=fff'} 
                            alt={doctor.firstName}
                            className={styles.doctorAvatar}
                          />
                          <div className={styles.doctorInfo}>
                            <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
                            <p>{doctor.specialization}</p>
                            <span className={styles.hospital}>{doctor.hospital}</span>
                          </div>
                          <div className={styles.statusBadgePending}>
                            Pending Review
                          </div>
                        </div>
                        
                        <div className={styles.doctorDetails}>
                          <div className={styles.detailRow}>
                            <span>License Number:</span>
                            <strong>{doctor.licenseNumber}</strong>
                          </div>
                          <div className={styles.detailRow}>
                            <span>Experience:</span>
                            <strong>{doctor.yearsOfExperience} years</strong>
                          </div>
                          <div className={styles.detailRow}>
                            <span>Qualifications:</span>
                            <span>{doctor.qualifications}</span>
                          </div>
                        </div>

                        {doctor.documents && doctor.documents.length > 0 && (
                          <div className={styles.documentsSection}>
                            <h5>Uploaded Documents:</h5>
                            <div className={styles.documentsList}>
                              {doctor.documents.map((doc, docIndex) => (
                                <div key={docIndex} className={styles.documentItem}>
                                  <i className="fas fa-file-pdf"></i>
                                  <span>{doc.name}</span>
                                  <span className={styles.docSize}>({doc.size})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className={styles.approvalActions}>
                          <button 
                            className="btn btn-success"
                            onClick={() => handleApproveDoctor(doctor.walletAddress)}
                          >
                            <i className="fas fa-check"></i>
                            Approve
                          </button>
                          <button 
                            className="btn btn-outline"
                            onClick={() => handleRejectDoctor(doctor.walletAddress)}
                          >
                            <i className="fas fa-times"></i>
                            Reject
                          </button>
                          <button 
                            className="btn btn-outline"
                            onClick={() => viewDoctorDocuments(doctor)}
                          >
                            <i className="fas fa-eye"></i>
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noPending}>
                    <i className="fas fa-check-circle"></i>
                    <p>No pending doctor registrations</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'system' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>System Settings</h2>
                <p>Manage platform configuration and preferences</p>
              </div>
              
              <div className={styles.settingsGrid}>
                <div className={styles.settingCard}>
                  <h3>Security Settings</h3>
                  <div className={styles.settingItem}>
                    <label>Two-Factor Authentication</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className={styles.settingItem}>
                    <label>Session Timeout</label>
                    <select defaultValue="30">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                </div>

                <div className={styles.settingCard}>
                  <h3>Platform Settings</h3>
                  <div className={styles.settingItem}>
                    <label>Maintenance Mode</label>
                    <input type="checkbox" />
                  </div>
                  <div className={styles.settingItem}>
                    <label>User Registration</label>
                    <select defaultValue="open">
                      <option value="open">Open</option>
                      <option value="invite">Invite Only</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.settingsActions}>
                <button className="btn btn-primary">Save Settings</button>
                <button className="btn btn-outline">Reset to Defaults</button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2>System Analytics</h2>
                <p>Platform usage statistics and insights</p>
              </div>
              
              <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                  <h3>User Growth</h3>
                  <div className={styles.chartPlaceholder}>
                    <i className="fas fa-chart-line"></i>
                    <p>User growth chart will be displayed here</p>
                  </div>
                </div>
                
                <div className={styles.analyticsCard}>
                  <h3>Activity Overview</h3>
                  <div className={styles.chartPlaceholder}>
                    <i className="fas fa-chart-bar"></i>
                    <p>Activity chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;