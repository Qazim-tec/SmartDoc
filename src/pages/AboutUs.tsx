// pages/AboutUs.tsx
import React from 'react';
import Demo from '../components/Demo';
import ProblemSolution from '../components/ProblemSolution';
import styles from '../styles/AboutUs.module.css';

const AboutUs: React.FC = () => {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.content}>
        <section className={styles.section}>
          <h1 className={styles.pageTitle}>About Us</h1>
          <p className={styles.pageSubtitle}>
            Learn more about Smart Doctor AI and how we empower medical students and professionals.
          </p>
        </section>
      </div>
      <Demo />
      <ProblemSolution />
    </div>
  );
};

export default AboutUs;