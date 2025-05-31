import React from 'react';
import styles from '../styles/Features.module.css';

const Features: React.FC = () => {
  return (
    <section className={styles.features} id="features">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Powerful Features for Health & Learning</h2>
        <p className={styles.sectionSubtitle}>
          Smart Doctor AI empowers users and medical students with advanced tools for diagnosis, nutrition, exercise, and exam preparation.
        </p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-comment-medical"></i>
            </div>
            <h3 className={styles.featureTitle}>AI Doctor Chat</h3>
            <p className={styles.featureDesc}>
              Chat with an AI doctor for instant differential diagnoses and treatment suggestions, powered by cutting-edge medical knowledge.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-utensils"></i>
            </div>
            <h3 className={styles.featureTitle}>Diet Analysis</h3>
            <p className={styles.featureDesc}>
              Get personalized diet plans to support weight loss or gain, tailored to your health goals and medical conditions.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-running"></i>
            </div>
            <h3 className={styles.featureTitle}>Exercise Plans</h3>
            <p className={styles.featureDesc}>
              Receive customized exercise recommendations based on your fitness level, health profile, and specific needs.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-stethoscope"></i>
            </div>
            <h3 className={styles.featureTitle}>Quick Diagnosis Aid</h3>
            <p className={styles.featureDesc}>
              Medical students can practice rapid diagnosis with case-based modules and receive instant feedback to hone skills.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-book-medical"></i>
            </div>
            <h3 className={styles.featureTitle}>MCQ Exam Practice</h3>
            <p className={styles.featureDesc}>
              Timed MCQs for medical and dental students to simulate exams, with detailed explanations and performance tracking.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-brain"></i>
            </div>
            <h3 className={styles.featureTitle}>Clinical Decision Support</h3>
            <p className={styles.featureDesc}>
              Access evidence-based recommendations to enhance clinical reasoning and decision-making for students and professionals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;