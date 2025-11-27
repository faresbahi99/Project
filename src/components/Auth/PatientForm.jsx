import React, { useState } from 'react';
import styles from './Auth.module.css';

const PatientForm = ({ onSubmit, onBack, walletAddress }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    emergencyContact: '',
    medicalHistory: '',
    avatar: ''
  });

  const [avatarPreview, setAvatarPreview] = useState('');

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
        setAvatarPreview(e.target.result);
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      role: 'patient',
      walletAddress: walletAddress,
      registrationDate: new Date().toISOString()
    });
  };

  return (
    <div className={styles.authForm}>
      <h2>Patient Registration</h2>
      <p>Complete your profile to get started</p>
      
      <div className={styles.avatarSection}>
        <div className={styles.avatarPreview}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Preview" className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>
        <div className={styles.avatarUpload}>
          <label htmlFor="avatar-upload" className="btn btn-outline">
            <i className="fas fa-upload"></i>
            Upload Photo
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {avatarPreview && (
            <button 
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setAvatarPreview('');
                setFormData(prev => ({ ...prev, avatar: '' }));
              }}
            >
              <i className="fas fa-trash"></i>
              Remove
            </button>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
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
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Name and phone number"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Medical History (Optional)</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows="4"
            placeholder="Any pre-existing conditions, allergies, or important medical information..."
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn btn-outline" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;