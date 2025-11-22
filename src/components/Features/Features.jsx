import React from 'react';
import styles from './Features.module.css';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Military-Grade Security',
      description: 'Your medical records are encrypted and stored on a decentralized blockchain network, ensuring maximum security against unauthorized access.',
      benefits: ['End-to-end encryption', 'Immutable records', 'Zero-knowledge proofs']
    },
    {
      icon: 'fas fa-user-lock',
      title: 'Complete Privacy Control',
      description: 'You decide who can access your health data and for how long. Full transparency and control over your personal information.',
      benefits: ['Granular permissions', 'Time-limited access', 'Access history tracking']
    },
    {
      icon: 'fas fa-bolt',
      title: 'Instant Access Anywhere',
      description: 'Access your medical records anytime, anywhere. Share with healthcare providers instantly when needed for better care coordination.',
      benefits: ['24/7 availability', 'Cross-platform access', 'Real-time sharing']
    },
    {
      icon: 'fas fa-handshake',
      title: 'Seamless Provider Collaboration',
      description: 'Healthcare providers can securely collaborate on patient care with proper consent, improving treatment outcomes.',
      benefits: ['Secure messaging', 'Shared care plans', 'Coordinated treatment']
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Health Analytics',
      description: 'Gain insights from your health data with privacy-preserving analytics that help you understand your health trends.',
      benefits: ['Personalized insights', 'Health trend analysis', 'Preventive care alerts']
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile First Design',
      description: 'Fully responsive design that works perfectly on all devices, ensuring you can manage your health on the go.',
      benefits: ['Mobile app access', 'Offline capability', 'Push notifications']
    }
  ];

  return (
    <section id="features" className={styles.features}>
      <div className="container">
        <div className="section-title">
          <h2>Why Choose MediChain?</h2>
          <p>Our platform offers cutting-edge solutions for managing your medical records securely and efficiently</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className={styles.featureBenefits}>
                {feature.benefits.map((benefit, idx) => (
                  <span key={idx} className={styles.benefitTag}>
                    <i className="fas fa-check"></i>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.featuresCta}>
          <div className={styles.ctaContent}>
            <h3>Ready to Experience Secure Healthcare?</h3>
            <p>Join thousands of users who trust MediChain with their medical data</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                const connectBtn = document.querySelector('.authButton');
                if (connectBtn) connectBtn.click();
              }}
            >
              Start Your Secure Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;