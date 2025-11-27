import React from 'react';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: 'fas fa-wallet',
      title: 'Connect Your Wallet',
      description: 'Securely connect your cryptocurrency wallet to create your decentralized identity.',
      details: ['MetaMask & WalletConnect support', 'No personal information required', 'Instant setup']
    },
    {
      number: 2,
      icon: 'fas fa-user-plus',
      title: 'Create Your Profile',
      description: 'Register as a patient or healthcare provider with the appropriate credentials.',
      details: ['Patient: Basic health profile', 'Provider: Professional verification', 'Role-based access']
    },
    {
      number: 3,
      icon: 'fas fa-file-upload',
      title: 'Upload Medical Records',
      description: 'Securely upload your medical documents and records to the blockchain network.',
      details: ['Encrypted file storage', 'Multiple format support', 'Automated organization']
    },
    {
      number: 4,
      icon: 'fas fa-share-alt',
      title: 'Manage Access & Sharing',
      description: 'Control exactly who can view your records and for how long with granular permissions.',
      details: ['Selective sharing', 'Time-limited access', 'Revoke anytime']
    }
  ];

  const useCases = [
    {
      role: 'patient',
      title: 'For Patients',
      features: [
        'Complete control over medical data',
        'Easy sharing with healthcare providers',
        'Emergency access for critical situations',
        'Health trend monitoring and insights'
      ]
    },
    {
      role: 'doctor',
      title: 'For Healthcare Providers',
      features: [
        'Secure access to patient records',
        'Collaborative care coordination',
        'Reduced administrative overhead',
        'Compliance with healthcare regulations'
      ]
    },
    {
      role: 'emergency',
      title: 'Emergency Situations',
      features: [
        'Instant access to critical information',
        'Emergency contact notifications',
        'Allergy and medication alerts',
        'Life-saving data availability'
      ]
    }
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className="container">
        <div className="section-title">
          <h2>How MediChain Works</h2>
          <p>A simple, secure process for managing your healthcare data on the blockchain</p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>
                {step.number}
              </div>
              <div className={styles.stepIcon}>
                <i className={step.icon}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className={styles.stepDetails}>
                {step.details.map((detail, idx) => (
                  <span key={idx} className={styles.detailItem}>
                    <i className="fas fa-check-circle"></i>
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.useCases}>
          <h3>Use Cases</h3>
          <div className={styles.useCasesGrid}>
            {useCases.map((useCase, index) => (
              <div key={index} className={styles.useCaseCard}>
                <div className={styles.useCaseHeader}>
                  <i className={`fas fa-${useCase.role === 'patient' ? 'user-injured' : useCase.role === 'doctor' ? 'user-md' : 'ambulance'}`}></i>
                  <h4>{useCase.title}</h4>
                </div>
                <ul className={styles.useCaseFeatures}>
                  {useCase.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-arrow-right"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;