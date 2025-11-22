import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h3>MediChain</h3>
            <p>Secure medical records on blockchain technology. You own your health data.</p>
            <div className={styles.socialLinks}>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className={styles.footerColumn}>
            <h3>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#">Home</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>Resources</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>Contact Us</h3>
            <ul className={styles.footerLinks}>
              <li><i className="fas fa-envelope"></i> info@medichain.com</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-map-marker-alt"></i> 123 Healthcare St, MedCity</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} MediChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;