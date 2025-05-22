import styles from '../styles/Features.module.css';

const Features: React.FC = () => {
  return (
    <section className={styles.features} id="features">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Powerful Features</h2>
        <p className={styles.sectionSubtitle}>
          Smart Doctor AI offers a comprehensive suite of tools designed specifically for medical education and clinical practice.
        </p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-comment-medical"></i>
            </div>
            <h3 className={styles.featureTitle}>AI-Powered Medical Chat</h3>
            <p className={styles.featureDesc}>
              Get instant differential diagnoses and treatment suggestions through our advanced AI chat interface trained on medical literature.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-utensils"></i>
            </div>
            <h3 className={styles.featureTitle}>Personalized Diet Analysis</h3>
            <p className={styles.featureDesc}>
              Upload your health data and receive customized nutritional recommendations tailored to your specific needs and conditions.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-book-medical"></i>
            </div>
            <h3 className={styles.featureTitle}>Exam Preparation</h3>
            <p className={styles.featureDesc}>
              Access 50+ high-yield questions for any medical course with detailed explanations and references to key resources.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-running"></i>
            </div>
            <h3 className={styles.featureTitle}>Custom Exercise Plans</h3>
            <p className={styles.featureDesc}>
              Receive exercise suggestions based on your health profile, fitness level, and any physical limitations or conditions.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-stethoscope"></i>
            </div>
            <h3 className={styles.featureTitle}>Quick Diagnosis Assistance</h3>
            <p className={styles.featureDesc}>
              For medical students - practice your diagnostic skills with our case-based learning modules and get instant feedback.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <i className="fas fa-brain"></i>
            </div>
            <h3 className={styles.featureTitle}>Clinical Decision Support</h3>
            <p className={styles.featureDesc}>
              Evidence-based recommendations at your fingertips to support your clinical reasoning and decision-making process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;