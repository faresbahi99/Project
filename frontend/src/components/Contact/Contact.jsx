import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // محاكاة إرسال النموذج
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // إعادة تعيين الحالة بعد 5 ثوان
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      details: 'info@medichain.com',
      description: 'Send us an email anytime'
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Us',
      details: '123 Healthcare St, Tech City',
      description: 'Schedule a meeting with our team'
    },
    {
      icon: 'fas fa-comments',
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Get instant support'
    }
  ];

  const faqs = [
    {
      question: 'Is my medical data really secure?',
      answer: 'Yes! We use military-grade encryption and blockchain technology to ensure your data remains private and secure. Only you control who can access your information.'
    },
    {
      question: 'How do I share my records with a doctor?',
      answer: 'Simply navigate to the records section, select the files you want to share, and generate a secure access link with customizable permissions and expiration dates.'
    },
    {
      question: 'What happens in case of emergency?',
      answer: 'You can set up emergency contacts who will receive temporary access to critical medical information when needed.'
    },
    {
      question: 'Can healthcare organizations use MediChain?',
      answer: 'Absolutely! We offer enterprise solutions for hospitals and clinics to securely manage patient records while maintaining compliance with healthcare regulations.'
    }
  ];

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <div className="section-title">
          <h2>Contact Us</h2>
          <p>Get in touch with our team - we're here to help you with any questions</p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h3>Get In Touch</h3>
            <p>
              Have questions about MediChain? Our team is here to help you understand 
              how blockchain technology can transform your healthcare experience.
            </p>

            <div className={styles.contactMethods}>
              {contactMethods.map((method, index) => (
                <div key={index} className={styles.contactMethod}>
                  <div className={styles.methodIcon}>
                    <i className={method.icon}></i>
                  </div>
                  <div className={styles.methodInfo}>
                    <h4>{method.title}</h4>
                    <p className={styles.methodDetails}>{method.details}</p>
                    <p className={styles.methodDescription}>{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.faqSection}>
              <h4>Frequently Asked Questions</h4>
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <h5>{faq.question}</h5>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="security">Security Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending Message...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>

              {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                  <i className="fas fa-check-circle"></i>
                  Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;