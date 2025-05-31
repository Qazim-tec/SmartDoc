import React from 'react';
import styles from '../styles/Demo.module.css';
import medicalRobot from '../assets/ai-robot-doctor-analyzing-human-body-scan-data-medical-interface-ai-robot-doctor-analyzing-human-body-scan-data-futuristic-371553142.webp'; // Replace with actual image file name

const Demo: React.FC = () => {
  return (
    <section className={styles.demo} id="demo">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Discover Smart Doctor AI</h2>
        <div className={styles.demoContainer}>
          <div className={styles.demoContent}>
            <h3 className={styles.demoTitle}>Your AI-Powered Healthcare Companion</h3>
            <p className={styles.demoDesc}>
              Smart Doctor AI provides real-time differential diagnoses, treatment plans, dietary analysis, exercise suggestions, and practice MCQs for medical and dental students, all tailored to your needs.
            </p>
            <div className={styles.demoFeatures}>
              <div className={styles.demoFeature}>
                <i className="fas fa-diagnoses"></i>
                <span>Accurate Differential Diagnosis</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-prescription"></i>
                <span>Personalized Treatment Plans</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-utensils"></i>
                <span>Dietary Analysis & Plans</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-dumbbell"></i>
                <span>Custom Exercise Suggestions</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-question-circle"></i>
                <span>MCQ Practice for Students</span>
              </div>
            </div>
            <a href="#" className={styles.btn}>Explore Now</a>
          </div>
          <div className={styles.demoVisual}>
            <img
              src={medicalRobot}
              alt="Smart Doctor AI Robot"
              className={styles.robotImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;