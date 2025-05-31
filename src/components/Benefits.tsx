import React from 'react';
import styles from '../styles/Benefits.module.css';
import aiDoctor from '../assets/ai-robot-doctor-analyzing-human-body-scan-data-medical-interface-ai-robot-doctor-analyzing-human-body-scan-data-futuristic-371553142.webp'; // Your image path

const Benefits: React.FC = () => {
  return (
    <section className={styles.benefits} id="benefits">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Why Choose Smart Doctor AI</h2>
        
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsContent}>
            <h3 className={styles.benefitsTitle}>Comprehensive AI Healthcare Solutions</h3>
            <p className={styles.benefitsDesc}>
              Smart Doctor AI revolutionizes healthcare with advanced diagnostics, personalized wellness plans, and medical education tools.
            </p>
            
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <i className="fas fa-user-md"></i>
                <div>
                  <h4>24/7 Medical Assistant</h4>
                  <p>Instant access to AI-powered diagnoses anytime</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <i className="fas fa-heartbeat"></i>
                <div>
                  <h4>Personalized Health Plans</h4>
                  <p>Custom diet and exercise recommendations</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <h4>Medical Training</h4>
                  <p>Case simulations for students and professionals</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <i className="fas fa-chart-line"></i>
                <div>
                  <h4>Health Tracking</h4>
                  <p>Monitor progress with adaptive recommendations</p>
                </div>
              </div>
            </div>
            
            <a href="#" className={styles.btn}>Get Started</a>
          </div>
          
          <div className={styles.benefitsVisual}>
            <img src={aiDoctor} alt="AI Doctor Benefits" className={styles.doctorImage} />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Benefits;