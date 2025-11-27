import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAuth } from '../../contexts/AuthContext';
import RoleSelection from './RoleSelection';
import PatientForm from './PatientForm';
import DoctorForm from './DoctorForm';
import AdminLogin from './AdminLogin';
import styles from './Auth.module.css';

const LoginModal = ({ onClose }) => {
  const { connectWallet, account, isConnected } = useWeb3();
  const { login, adminLogin, autoLogin, register, userDatabase, loading } = useAuth();
  const [step, setStep] = useState('type');
  const [selectedRole, setSelectedRole] = useState(null);
  const [loginType, setLoginType] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  // التحقق من حالة المستخدم عند تغيير المحفظة
  useEffect(() => {
    if (account && step === 'connect') {
      checkUserRegistration();
    }
  }, [account, step]);

  const checkUserRegistration = async () => {
    if (userDatabase.isUserRegistered(account)) {
      setIsRegistered(true);
      if (!autoLoginAttempted) {
        setAutoLoginAttempted(true);
        try {
          await autoLogin(account);
          onClose();
        } catch (error) {
          console.log('Auto-login failed');
        }
      }
    } else {
      setIsRegistered(false);
    }
  };

  const handleLoginTypeSelect = (type) => {
    setLoginType(type);
    setStep('connect');
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      await checkUserRegistration();
      
      if (loginType === 'admin') {
        setStep('verify');
      } else if (isRegistered) {
        // إذا كان مسجلاً، تسجيل دخول تلقائي وإغلاق النافذة
        try {
          await autoLogin(account);
          onClose();
        } catch (error) {
          setStep('role');
        }
      } else {
        setStep('role');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (loginType === 'user' && selectedRole === 'doctor') {
        // للطبيب، نستخدم onSuccess الخاص بالطبيب
        return;
      } else {
        // للمريض، التسجيل العادي
        const completeUserData = {
          ...userData,
          walletAddress: account,
          avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=2E86AB&color=fff`
        };
        
        await register(completeUserData);
        onClose();
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleAdminSuccess = () => {
    onClose();
  };

  const handleDoctorSuccess = (doctorData) => {
    // بعد نجاح تسجيل الطبيب
    setUser(doctorData);
    setIsAuthenticated(true);
    localStorage.setItem('medichain_user', JSON.stringify(doctorData));
    
    // إظهار رسالة النجاح
    setStep('success');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('role');
    } else if (step === 'role' || step === 'verify') {
      setStep('connect');
    } else if (step === 'connect') {
      setStep('type');
    } else if (step === 'success') {
      onClose();
    }
  };

  const handleQuickLogin = () => {
    autoLogin(account)
      .then(() => onClose())
      .catch(error => {
        console.error('Quick login failed:', error);
        setStep('role');
      });
  };

  const handleQuickRegister = () => {
    setStep('role');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {step === 'type' && (
          <div className={styles.loginTypeSelection}>
            <h2>Welcome to MediChain</h2>
            <p>Choose your login type</p>
            <div className={styles.loginTypeOptions}>
              <div 
                className={styles.loginTypeCard}
                onClick={() => handleLoginTypeSelect('user')}
              >
                <div className={styles.typeIcon}>
                  <i className="fas fa-user"></i>
                </div>
                <h3>User Login</h3>
                <p>Access as Patient or Healthcare Provider</p>
                <div className={styles.typeFeatures}>
                  <span><i className="fas fa-check"></i> Manage Medical Records</span>
                  <span><i className="fas fa-check"></i> Book Appointments</span>
                  <span><i className="fas fa-check"></i> Control Data Access</span>
                </div>
              </div>
              
              <div 
                className={styles.loginTypeCard}
                onClick={() => handleLoginTypeSelect('admin')}
              >
                <div className={`${styles.typeIcon} ${styles.adminIcon}`}>
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Admin Access</h3>
                <p>System Administration Panel</p>
                <div className={styles.typeFeatures}>
                  <span><i className="fas fa-check"></i> User Management</span>
                  <span><i className="fas fa-check"></i> System Analytics</span>
                  <span><i className="fas fa-check"></i> Platform Settings</span>
                </div>
                <div className={styles.adminBadge}>Restricted Access</div>
              </div>
            </div>
          </div>
        )}

        {step === 'connect' && (
          <div className={styles.connectStep}>
            <div className={styles.modalIcon}>
              <i className={loginType === 'admin' ? 'fas fa-shield-alt' : 'fas fa-wallet'}></i>
            </div>
            
            {!isConnected ? (
              <>
                <h2>{loginType === 'admin' ? 'Admin Access' : 'Connect Wallet'}</h2>
                <p>
                  {loginType === 'admin' 
                    ? 'Connect your admin wallet to access the administration panel'
                    : 'Connect your wallet to get started with MediChain'
                  }
                </p>
                <button 
                  className={`btn ${loginType === 'admin' ? 'btn-danger' : 'btn-primary'}`} 
                  onClick={handleConnectWallet}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : `Connect ${loginType === 'admin' ? 'Admin ' : ''}Wallet`}
                </button>
              </>
            ) : (
              <>
                <h2>Wallet Connected</h2>
                <div className={styles.walletConnected}>
                  <i className="fas fa-check-circle"></i>
                  <p>Successfully connected to your wallet</p>
                  <div className={styles.walletAddress}>
                    {account?.slice(0, 8)}...{account?.slice(-6)}
                  </div>
                  <div className={styles.registrationStatus}>
                    {isRegistered ? (
                      <span className={styles.statusRegistered}>
                        <i className="fas fa-check"></i>
                        Account Found - Ready to Sign In
                      </span>
                    ) : (
                      <span className={styles.statusNotRegistered}>
                        <i className="fas fa-user-plus"></i>
                        New User - Ready to Register
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={styles.connectedActions}>
                  {isRegistered ? (
                    <button 
                      className="btn btn-primary"
                      onClick={handleQuickLogin}
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In to Your Account'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={handleQuickRegister}
                    >
                      <i className="fas fa-user-plus"></i>
                      Create New Account
                    </button>
                  )}
                  
                  {loginType === 'admin' && (
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setStep('verify')}
                    >
                      Continue to Admin Verification
                    </button>
                  )}
                </div>
              </>
            )}
            
            <button 
              className="btn btn-outline" 
              onClick={handleBack}
              style={{ marginTop: '15px' }}
            >
              Back
            </button>
          </div>
        )}

        {step === 'role' && loginType === 'user' && (
          <RoleSelection onRoleSelect={handleRoleSelect} />
        )}

        {step === 'form' && selectedRole === 'patient' && loginType === 'user' && (
          <PatientForm 
            onSubmit={handleFormSubmit} 
            onBack={handleBack}
            walletAddress={account}
          />
        )}

        {step === 'form' && selectedRole === 'doctor' && loginType === 'user' && (
          <DoctorForm 
            onSubmit={handleFormSubmit} 
            onBack={handleBack}
            walletAddress={account}
            onSuccess={handleDoctorSuccess}
          />
        )}

        {step === 'verify' && loginType === 'admin' && (
          <AdminLogin 
            onBack={handleBack}
            onSuccess={handleAdminSuccess}
            walletAddress={account}
          />
        )}

        {step === 'success' && (
          <div className={styles.successStep}>
            <div className={styles.successIcon}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Registration Submitted Successfully!</h2>
            <div className={styles.successMessage}>
              <p>Your healthcare provider registration has been submitted for review.</p>
              <div className={styles.successDetails}>
                <div className={styles.detailItem}>
                  <i className="fas fa-clock"></i>
                  <span>Status: <strong>Under Review</strong></span>
                </div>
                <div className={styles.detailItem}>
                  <i className="fas fa-envelope"></i>
                  <span>You will be notified once approved</span>
                </div>
                <div className={styles.detailItem}>
                  <i className="fas fa-history"></i>
                  <span>Processing time: 24-48 hours</span>
                </div>
              </div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={onClose}
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;