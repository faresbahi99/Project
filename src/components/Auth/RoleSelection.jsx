import React from 'react';
import styles from './Auth.module.css';

const RoleSelection = ({ onRoleSelect }) => {
  return (
    <div className={styles.roleSelection}>
      <h2>Select Your Role</h2>
      <p>Choose how you want to use MediChain</p>
      <div className={styles.roleOptions}>
        <div className={styles.roleCard} onClick={() => onRoleSelect('patient')}>
          <div className={styles.roleIcon}>
            <i className="fas fa-user-injured"></i>
          </div>
          <h3>Patient</h3>
          <p>Manage your medical records and control access to your health data</p>
        </div>
        <div className={styles.roleCard} onClick={() => onRoleSelect('doctor')}>
          <div className={styles.roleIcon}>
            <i className="fas fa-user-md"></i>
          </div>
          <h3>Healthcare Provider</h3>
          <p>Access patient records with permission and provide medical services</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;