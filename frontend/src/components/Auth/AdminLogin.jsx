import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

const AdminLogin = ({ onBack, onSuccess, walletAddress }) => {
  const { connectWallet, account } = useWeb3();
  const { adminLogin, loading } = useAuth();
  const [adminKey, setAdminKey] = useState('');
  const [step, setStep] = useState('connect');

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setStep('verify');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleAdminVerification = async (e) => {
    e.preventDefault();
    
    if (!adminKey) {
      alert('Please enter admin key');
      return;
    }

    try {
      await adminLogin({
        walletAddress: walletAddress || account,
        firstName: 'System',
        lastName: 'Administrator',
        adminKey: adminKey,
        avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=dc3545&color=fff'
      });
      onSuccess();
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Invalid admin key or access denied');
    }
  };

  return (
    <div className={styles.adminLogin}>
      {step === 'connect' && (
        <div className={styles.connectStep}>
          <div className={styles.modalIcon}>
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2>Admin Access</h2>
          <p>Connect your admin wallet to access the administration panel</p>
          <button 
            className="btn btn-danger" 
            onClick={handleConnectWallet}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Admin Wallet'}
          </button>
          <button 
            className="btn btn-outline" 
            onClick={onBack}
            style={{ marginTop: '15px' }}
          >
            Back to User Login
          </button>
        </div>
      )}

      {step === 'verify' && (
        <form onSubmit={handleAdminVerification} className={styles.adminForm}>
          <div className={styles.modalIcon}>
            <i className="fas fa-key"></i>
          </div>
          <h2>Admin Verification</h2>
          <p>Enter your admin key to continue</p>
          
          <div className={styles.walletInfo}>
            <i className="fas fa-wallet"></i>
            <span>Connected: {account?.slice(0, 8)}...{account?.slice(-6)}</span>
          </div>

          <div className={styles.formGroup}>
            <label>Admin Security Key</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter TEST_KEY for testing..."
              required
            />
            <small className={styles.helpText}>
              Use TEST_KEY for testing purposes
            </small>
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn btn-outline" onClick={() => setStep('connect')}>
              Back
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminLogin;