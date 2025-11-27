import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { account } = useWeb3();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ 
          ...prev, 
          avatar: e.target.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone! All your data will be permanently lost.')) {
      deleteAccount();
      alert('Account deleted successfully');
    }
  };

  const truncateAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!user) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <div className={styles.notAuthenticated}>
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Authentication Required</h2>
            <p>Please connect your wallet and log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <div className="container">
        <div className={styles.profileHeader}>
          <div className={styles.headerLeft}>
            <h2>Profile Information</h2>
            {user.approvalStatus === 'pending' && (
              <div className={styles.pendingBadge}>
                <i className="fas fa-clock"></i>
                Awaiting Approval
              </div>
            )}
            {user.approvalStatus === 'approved' && (
              <div className={styles.approvedBadge}>
                <i className="fas fa-check-circle"></i>
                Verified Doctor
              </div>
            )}
          </div>
          <div className={styles.headerActions}>
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className="fas fa-edit"></i>
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteAccount}
            >
              <i className="fas fa-trash"></i>
              Delete Account
            </button>
          </div>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.profileSidebar}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                <img 
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2E86AB&color=fff'} 
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className={styles.avatar}
                />
                {isEditing && (
                  <div className={styles.avatarOverlay}>
                    <label htmlFor="avatar-upload" className={styles.uploadLabel}>
                      <i className="fas fa-camera"></i>
                      Change Photo
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p className={styles.role}>
                {user?.role === 'doctor' ? 'Healthcare Provider' : 'Patient'}
                {user?.specialization && ` • ${user.specialization}`}
              </p>
              
              <div className={styles.walletInfo}>
                <i className="fas fa-wallet"></i>
                <span>{truncateAddress(account)}</span>
              </div>
            </div>

            <div className={styles.quickInfo}>
              <div className={styles.infoItem}>
                <i className="fas fa-calendar"></i>
                <div>
                  <span>Member Since</span>
                  <strong>{new Date(user?.registrationDate).toLocaleDateString()}</strong>
                </div>
              </div>
              {user?.hospital && (
                <div className={styles.infoItem}>
                  <i className="fas fa-hospital"></i>
                  <div>
                    <span>Hospital/Clinic</span>
                    <strong>{user.hospital}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.profileMain}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.formSection}>
                  <h3>Personal Information</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {user?.role === 'patient' && (
                    <>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Gender</label>
                          <select
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Emergency Contact</label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact || ''}
                          onChange={handleChange}
                          placeholder="Name and phone number"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Medical History</label>
                        <textarea
                          name="medicalHistory"
                          value={formData.medicalHistory || ''}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Any pre-existing conditions, allergies, or important medical information..."
                        />
                      </div>
                    </>
                  )}

                  {user?.role === 'doctor' && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Specialization</label>
                        <select
                          name="specialization"
                          value={formData.specialization || ''}
                          onChange={handleChange}
                        >
                          <option value="">Select Specialization</option>
                          <option value="cardiology">Cardiology</option>
                          <option value="neurology">Neurology</option>
                          <option value="pediatrics">Pediatrics</option>
                          <option value="surgery">Surgery</option>
                          <option value="dermatology">Dermatology</option>
                          <option value="psychiatry">Psychiatry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Medical License Number</label>
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Years of Experience</label>
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience || ''}
                            onChange={handleChange}
                            min="0"
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Hospital/Clinic</label>
                        <input
                          type="text"
                          name="hospital"
                          value={formData.hospital || ''}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Qualifications</label>
                        <textarea
                          name="qualifications"
                          value={formData.qualifications || ''}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Medical degrees, certifications, etc."
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.formActions}>
                  <button type="button" className="btn btn-outline" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileDetails}>
                <div className={styles.detailSection}>
                  <h3>Personal Information</h3>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <label>Full Name</label>
                      <span>{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Role</label>
                      <span>{user?.role === 'doctor' ? 'Healthcare Provider' : 'Patient'}</span>
                    </div>
                    {user?.role === 'patient' && (
                      <>
                        <div className={styles.detailItem}>
                          <label>Date of Birth</label>
                          <span>{user?.dateOfBirth || 'Not specified'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Gender</label>
                          <span>{user?.gender || 'Not specified'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Phone</label>
                          <span>{user?.phone || 'Not specified'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Emergency Contact</label>
                          <span>{user?.emergencyContact || 'Not specified'}</span>
                        </div>
                      </>
                    )}
                    {user?.role === 'doctor' && (
                      <>
                        <div className={styles.detailItem}>
                          <label>Specialization</label>
                          <span>{user?.specialization || 'Not specified'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>License Number</label>
                          <span>{user?.licenseNumber || 'Not specified'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Years of Experience</label>
                          <span>{user?.yearsOfExperience || 'Not specified'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <label>Hospital/Clinic</label>
                          <span>{user?.hospital || 'Not specified'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {(user?.medicalHistory || user?.qualifications) && (
                  <div className={styles.detailSection}>
                    <h3>{user?.role === 'doctor' ? 'Qualifications' : 'Medical History'}</h3>
                    <div className={styles.longText}>
                      {user?.role === 'doctor' ? user?.qualifications : user?.medicalHistory}
                    </div>
                  </div>
                )}

                <div className={styles.detailSection}>
                  <h3>Account Information</h3>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <label>Wallet Address</label>
                      <span className={styles.walletAddress}>{truncateAddress(account)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Registration Date</label>
                      <span>{new Date(user?.registrationDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Account Status</label>
                      <span className={user?.isVerified ? styles.statusVerified : styles.statusPending}>
                        {user?.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;