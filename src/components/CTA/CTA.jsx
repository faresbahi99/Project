import React from 'react';
import styles from './CTA.module.css';

const CTA = () => {
  return (
    <section className={styles.cta}>
      <div className="container">
        <h2>Ready to Take Control of Your Health Data?</h2>
        <p>Join thousands of users who trust MediChain for secure, private medical record management.</p>
        <div className={styles.ctaButtons}>
          <a href="#" className="btn btn-light">Get Started Now</a>
          <a href="#" className={`btn btn-outline ${styles.ctaOutline}`}>Schedule a Demo</a>
        </div>
      </div>
    </section>
  );
};

export default CTA;