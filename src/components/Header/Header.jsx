import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import styles from './Header.module.css';

const Header = ({ onConnectWallet }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { account, isConnected, disconnectWallet } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // التحقق من تسجيل المستخدم عند تغيير المحفظة
  useEffect(() => {
    if (account) {
      checkUserRegistration();
    }
  }, [account]);

  const checkUserRegistration = () => {
    const userDatabase = JSON.parse(localStorage.getItem('medichain_users') || '{}');
    setIsRegistered(!!userDatabase[account?.toLowerCase()]);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowDropdown(!showDropdown);
    } else if (isConnected && isRegistered) {
      onConnectWallet('login');
    } else if (isConnected && !isRegistered) {
      onConnectWallet('register');
    } else {
      onConnectWallet('connect');
    }
  };

  const handleLogout = () => {
    logout();
    disconnectWallet();
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    window.location.hash = '#profile';
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const handleDashboardClick = () => {
    window.location.hash = '#dashboard';
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const handleHomeClick = () => {
    setShowMobileMenu(false);
    if (isAuthenticated) {
      window.location.hash = 'dashboard';
    } else {
      window.location.hash = 'home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigationClick = (sectionId) => {
    setShowMobileMenu(false);
    setShowDropdown(false);
    
    if (sectionId.startsWith('#')) {
      window.location.hash = sectionId;
    } else {
      // إذا كان المستخدم مسجلاً وطلب قسم من الصفحة الرئيسية
      if (isAuthenticated && ['home', 'features', 'how-it-works', 'about', 'contact'].includes(sectionId)) {
        // الانتقال إلى الصفحة الرئيسية مع الهاش
        window.location.hash = sectionId;
      } else if (!isAuthenticated) {
        // للزوار، الانتقال السلس داخل الصفحة
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // للمستخدمين المسجلين، استخدام الهاش للتنقل
        window.location.hash = sectionId;
      }
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getAuthButtonText = () => {
    if (isAuthenticated) {
      return `${user?.firstName} ${user?.lastName}`;
    } else if (isConnected && isRegistered) {
      return 'Sign In';
    } else if (isConnected && !isRegistered) {
      return 'Register';
    } else {
      return 'Connect Wallet';
    }
  };

  const getAuthButtonIcon = () => {
    if (isAuthenticated) {
      return 'fas fa-user';
    } else if (isConnected) {
      return 'fas fa-sign-in-alt';
    } else {
      return 'fas fa-plug';
    }
  };

  // عناصر التنقل الديناميكية بناءً على حالة المستخدم
  const getNavigationItems = () => {
    if (isAuthenticated) {
      const baseItems = [
        { 
          id: 'dashboard',
          label: 'Dashboard', 
          icon: 'fas fa-home', 
          onClick: () => handleNavigationClick('dashboard')
        },
        { 
          id: 'records',
          label: 'Medical Records', 
          icon: 'fas fa-file-medical',
          onClick: () => handleNavigationClick('records')
        },
        { 
          id: 'appointments',
          label: 'Appointments', 
          icon: 'fas fa-calendar',
          onClick: () => handleNavigationClick('appointments')
        }
      ];

      if (user?.role === 'doctor' && user?.approvalStatus === 'approved') {
        baseItems.push({
          id: 'patients',
          label: 'Patients', 
          icon: 'fas fa-users',
          onClick: () => handleNavigationClick('patients')
        });
      } else if (user?.role === 'patient') {
        baseItems.push({
          id: 'doctors',
          label: 'Doctors', 
          icon: 'fas fa-user-md',
          onClick: () => handleNavigationClick('doctors')
        });
      }

      return baseItems;
    } else {
      // عناصر التنقل للزوار
      return [
        { 
          id: 'home',
          label: 'Home', 
          icon: 'fas fa-home',
          onClick: handleHomeClick
        },
        { 
          id: 'features',
          label: 'Features', 
          icon: 'fas fa-star',
          onClick: () => handleNavigationClick('features')
        },
        { 
          id: 'how-it-works',
          label: 'How It Works', 
          icon: 'fas fa-play-circle',
          onClick: () => handleNavigationClick('how-it-works')
        },
        { 
          id: 'about',
          label: 'About', 
          icon: 'fas fa-info-circle',
          onClick: () => handleNavigationClick('about')
        },
        { 
          id: 'contact',
          label: 'Contact', 
          icon: 'fas fa-envelope',
          onClick: () => handleNavigationClick('contact')
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <div className={styles.topBarLeft}>
              <span className={styles.badge}>
                <i className="fas fa-shield-alt"></i>
                Secure • Private • Decentralized
              </span>
            </div>
            <div className={styles.topBarRight}>
              <span>
                <i className="fas fa-phone"></i>
                Support: +1 (555) 123-4567
              </span>
              <span>
                <i className="fas fa-envelope"></i>
                info@medichain.com
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className="container">
          <nav className={styles.navbar}>
            <div className={styles.logoSection}>
              <a href="#home" className={styles.logo} onClick={handleHomeClick}>
                <div className={styles.logoIcon}>
                  <i className="fas fa-link"></i>
                </div>
                <div className={styles.logoText}>
                  <h1>Medi<span>Chain</span></h1>
                  <p>Blockchain Healthcare</p>
                </div>
              </a>
            </div>

            <div className={`${styles.navLinks} ${showMobileMenu ? styles.mobileActive : ''}`}>
              <ul className={styles.navList}>
                {navigationItems.map((item, index) => (
                  <li key={index} className={styles.navItem}>
                    <button 
                      className={styles.navLink}
                      onClick={item.onClick}
                    >
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {isConnected && account && (
                <div className={styles.walletInfo}>
                  <div className={styles.walletStatus}>
                    <i className="fas fa-wallet"></i>
                    <div className={styles.walletDetails}>
                      <span className={styles.walletAddress}>{truncateAddress(account)}</span>
                      <div className={styles.connectionStatus}>
                        <div className={styles.statusDot}></div>
                        <span>
                          {isRegistered ? 'Registered' : 'Not Registered'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.userSection}>
              {isConnected && account && (
                <div className={styles.walletBadge}>
                  <i className="fas fa-wallet"></i>
                  <span>{truncateAddress(account)}</span>
                </div>
              )}
              
              <div className={styles.authContainer}>
                <button 
                  className={`${styles.authButton} ${isAuthenticated ? styles.authenticated : ''} ${isConnected && !isAuthenticated ? styles.connected : ''}`}
                  onClick={handleAuthClick}
                >
                  <i className={getAuthButtonIcon()}></i>
                  <span>{getAuthButtonText()}</span>
                  {isAuthenticated && <i className="fas fa-chevron-down"></i>}
                </button>

                {showDropdown && isAuthenticated && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <img 
                        src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2E86AB&color=fff'} 
                        alt={user?.firstName}
                        className={styles.dropdownAvatar}
                      />
                      <div className={styles.dropdownUserInfo}>
                        <h4>{user?.firstName} {user?.lastName}</h4>
                        <p>{user?.role === 'doctor' ? 'Healthcare Provider' : 'Patient'}</p>
                        <span className={styles.userWallet}>{truncateAddress(account)}</span>
                      </div>
                    </div>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <button className={styles.dropdownItem} onClick={handleDashboardClick}>
                      <i className="fas fa-tachometer-alt"></i>
                      Dashboard
                    </button>
                    
                    <button className={styles.dropdownItem} onClick={handleProfileClick}>
                      <i className="fas fa-user-edit"></i>
                      My Profile
                    </button>
                    
                    <button className={styles.dropdownItem} onClick={() => handleNavigationClick('settings')}>
                      <i className="fas fa-cog"></i>
                      Settings
                    </button>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <button className={styles.dropdownItem} onClick={() => handleNavigationClick('help')}>
                      <i className="fas fa-question-circle"></i>
                      Help & Support
                    </button>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <button 
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button 
                className={`${styles.mobileMenuButton} ${showMobileMenu ? styles.active : ''}`}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;