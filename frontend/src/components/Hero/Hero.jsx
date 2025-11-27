import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import styles from './Hero.module.css';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();
  const { isConnected } = useWeb3();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.hash = 'dashboard';
    } else {
      const connectBtn = document.querySelector('.authButton');
      if (connectBtn) connectBtn.click();
    }
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Secure Medical Records on Blockchain</h1>
            <p>You own your health data. You control who sees it. Complete privacy and security.</p>
            
            {isAuthenticated ? (
              <div className={styles.welcomeMessage}>
                <h3>Welcome back, {user?.firstName}!</h3>
                <p>Ready to manage your {user?.role === 'doctor' ? 'medical practice' : 'health records'}?</p>
              </div>
            ) : (
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <strong>10,000+</strong>
                  <span>Patients Served</span>
                </div>
                <div className={styles.stat}>
                  <strong>500+</strong>
                  <span>Healthcare Providers</span>
                </div>
                <div className={styles.stat}>
                  <strong>99.9%</strong>
                  <span>Uptime</span>
                </div>
              </div>
            )}

            <div className={styles.heroButtons}>
              <button className="btn btn-primary" onClick={handleGetStarted}>
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
              <button className="btn btn-outline" onClick={handleLearnMore}>
                Learn More
              </button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.placeholderImage}>
              <i className="fas fa-shield-alt"></i>
              <div className={styles.imageOverlay}>
                <h4>Blockchain Protected</h4>
                <p>Immutable & Secure Health Records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;