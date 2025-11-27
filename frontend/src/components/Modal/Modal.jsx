import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalIcon}>
          <i className="fas fa-check"></i>
        </div>
        <h2>Success!</h2>
        <p>MediChain is now working correctly!</p>
        <button className="btn btn-primary" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
};

export default Modal;