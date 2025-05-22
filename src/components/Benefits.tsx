import styles from '../styles/Benefits.module.css';

const Benefits: React.FC = () => {
  return (
    <section className={styles.benefits} id="benefits">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Benefits for Medical Students</h2>
        <p className={styles.sectionSubtitle}>
          Smart Doctor AI is designed to complement and enhance your medical education.
        </p>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <h3 className={styles.benefitTitle}>24/7 Study Partner</h3>
            <p className={styles.benefitDesc}>
              Get answers to your medical questions anytime, without waiting for office hours or study group meetings.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <h3 className={styles.benefitTitle}>Clinical Reasoning Practice</h3>
            <p className={styles.benefitDesc}>
              Develop your diagnostic skills with our case-based learning system that provides immediate feedback.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <h3 className={styles.benefitTitle}>Personalized Learning</h3>
            <p className={styles.benefitDesc}>
              Our AI adapts to your knowledge level and learning style, focusing on areas where you need improvement.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <h3 className={styles.benefitTitle}>Exam Preparation</h3>
            <p className={styles.benefitDesc}>
              Access high-yield questions and explanations tailored to your current coursework and upcoming exams.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <h3 className={styles.benefitTitle}>Time Efficiency</h3>
            <p className={styles.benefitDesc}>
              Quickly find explanations for complex topics without sifting through multiple textbooks and resources.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <h3 className={styles.benefitTitle}>Confidence Building</h3>
            <p className={styles.benefitDesc}>
              Practice clinical scenarios and receive feedback to build confidence before real patient interactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;