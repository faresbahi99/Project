import React, { useState } from 'react';
import styles from '../Auth/Auth.module.css';

const DoctorForm = ({ onSubmit, onBack, walletAddress }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    licenseNumber: '',
    hospital: '',
    yearsOfExperience: '',
    qualifications: '',
    avatar: ''
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      alert('Only PDF files are allowed');
      return;
    }

    const newDocuments = pdfFiles.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: 'pdf',
      uploadDate: new Date().toLocaleDateString()
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (documents.length === 0) {
      alert('Please upload at least one document (Medical License, Certifications, etc.)');
      return;
    }

    setIsSubmitting(true);

    try {
      // محاكاة رفع المستندات
      const uploadedDocuments = await Promise.all(
        documents.map(async (doc) => {
          // في التطبيق الحقيقي، هنا سيتم رفع الملفات إلى الخادم
          return {
            name: doc.name,
            size: doc.size,
            type: doc.type,
            uploadDate: doc.uploadDate,
            status: 'pending'
          };
        })
      );

      const doctorData = {
        ...formData,
        role: 'doctor',
        walletAddress: walletAddress,
        registrationDate: new Date().toISOString(),
        documents: uploadedDocuments,
        status: 'pending_approval',
        isVerified: false,
        approvalStatus: 'pending'
      };

      // حفظ في localStorage لمحاكاة قاعدة البيانات
      const pendingDoctors = JSON.parse(localStorage.getItem('medichain_pending_doctors') || '[]');
      pendingDoctors.push(doctorData);
      localStorage.setItem('medichain_pending_doctors', JSON.stringify(pendingDoctors));

      onSubmit(doctorData);
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Error uploading documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>Healthcare Provider Registration</h2>
      <p>Complete your professional profile and upload required documents</p>
      
      <div className={styles.avatarSection}>
        <div className={styles.avatarPreview}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Preview" className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <i className="fas fa-user-md"></i>
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
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Specialization *</label>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Select Specialization</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="surgery">Surgery</option>
            <option value="dermatology">Dermatology</option>
            <option value="psychiatry">Psychiatry</option>
            <option value="general">General Practitioner</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Medical License Number *</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Years of Experience *</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Hospital/Clinic *</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Qualifications *</label>
          <textarea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            rows="3"
            placeholder="Medical degrees, certifications, etc."
            required
          />
        </div>

        {/* قسم رفع المستندات */}
        <div className={styles.documentsSection}>
          <h3>Required Documents</h3>
          <p>Upload your professional documents in PDF format</p>
          
          <div className={styles.documentsUpload}>
            <label htmlFor="documents-upload" className={styles.uploadArea}>
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Click to upload documents (PDF only)</span>
              <small>Medical License, Certifications, ID, etc.</small>
            </label>
            <input
              id="documents-upload"
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleDocumentUpload}
              style={{ display: 'none' }}
            />
          </div>

          {documents.length > 0 && (
            <div className={styles.documentsList}>
              <h4>Uploaded Documents:</h4>
              {documents.map((doc, index) => (
                <div key={index} className={styles.documentItem}>
                  <div className={styles.documentInfo}>
                    <i className="fas fa-file-pdf"></i>
                    <div>
                      <span className={styles.docName}>{doc.name}</span>
                      <span className={styles.docSize}>{doc.size}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className={styles.removeDoc}
                    onClick={() => removeDocument(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.registrationNote}>
          <i className="fas fa-info-circle"></i>
          <p>
            Your registration will be reviewed by our administration team. 
            You will be notified once your account is approved. This process usually takes 24-48 hours.
          </p>
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn btn-outline" onClick={onBack}>
            Back
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || documents.length === 0}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Submitting...
              </>
            ) : (
              'Submit for Approval'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;