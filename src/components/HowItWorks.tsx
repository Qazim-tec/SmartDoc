import styles from '../styles/HowItWorks.module.css';

const HowItWorks: React.FC = () => {
  return (
    <section className={styles.steps} id="how-it-works">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>
          Getting started with Smart Doctor AI is simple and straightforward.
        </p>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Sign Up</h3>
            <p className={styles.stepDesc}>
              Create your account in minutes. Choose between student or professional plans based on your needs.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Set Up Your Profile</h3>
            <p className={styles.stepDesc}>
              Provide basic health information and learning preferences to personalize your experience.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Start Learning</h3>
            <p className={styles.stepDesc}>
              Access all features including the AI chat, exam prep, and personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;