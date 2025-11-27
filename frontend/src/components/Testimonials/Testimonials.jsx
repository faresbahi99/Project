import React from 'react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      content: 'MediChain has revolutionized how we manage patient records. The security and accessibility are unmatched in the healthcare industry.',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Thompson',
      role: 'Patient',
      content: 'As someone with chronic conditions, having all my records in one secure place gives me peace of mind. I control who sees my data.',
      avatar: 'MT'
    },
    {
      id: 3,
      name: 'Dr. Robert Chen',
      role: 'Healthcare IT Specialist',
      content: 'The blockchain technology ensures data integrity while maintaining patient privacy. A true game-changer for modern healthcare.',
      avatar: 'RC'
    }
  ];

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className="container">
        <div className="section-title">
          <h2>What Our Users Say</h2>
          <p>Hear from healthcare professionals and patients who trust MediChain</p>
        </div>
        
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"{testimonial.content}"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {testimonial.avatar}
                </div>
                <div className={styles.authorInfo}>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;