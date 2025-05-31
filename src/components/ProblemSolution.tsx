import styles from '../styles/ProblemSolution.module.css';

const ProblemSolution = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Problem Section - Clean List */}
        <div className={styles.problemSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleAccent}>Healthcare Challenges</span> We Address
          </h2>
          <div className={styles.divider}></div>
          <ul className={styles.problemList}>
            <li className={styles.problemItem}>
              <div className={styles.problemIcon}>⏳</div>
              <div className={styles.problemContent}>
                <h3>Delayed Medical Access</h3>
                <p>Patients wait days/weeks for appointments while symptoms worsen</p>
              </div>
            </li>
            <li className={styles.problemItem}>
              <div className={styles.problemIcon}>🤷‍♂️</div>
              <div className={styles.problemContent}>
                <h3>Unclear Symptom Interpretation</h3>
                <p>Difficulty understanding which symptoms require urgent attention</p>
              </div>
            </li>
            <li className={styles.problemItem}>
              <div className={styles.problemIcon}>🍽️</div>
              <div className={styles.problemContent}>
                <h3>Generic Health Advice</h3>
                <p>One-size-fits-all diet/exercise plans that ignore individual health conditions</p>
              </div>
            </li>
            <li className={styles.problemItem}>
              <div className={styles.problemIcon}>🎓</div>
              <div className={styles.problemContent}>
                <h3>Limited Clinical Practice</h3>
                <p>Medical students lack accessible diagnostic training tools</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Solution Section - Card Grid */}
        <div className={styles.solutionSection}>
          <h2 className={styles.sectionTitle}>
            How <span className={styles.titleAccent}>Smart Doctor AI</span> Solves These
          </h2>
          <div className={styles.divider}></div>
          <div className={styles.solutionGrid}>
            <div className={styles.solutionCard}>
              <div className={styles.solutionIcon}>💬</div>
              <h3>AI-Powered Chat Diagnosis</h3>
              <ul className={styles.solutionFeatures}>
                <li>Instant symptom analysis</li>
                <li>Differential diagnosis</li>
                <li>Personalized treatment plans</li>
              </ul>
            </div>
            <div className={styles.solutionCard}>
              <div className={styles.solutionIcon}>⚖️</div>
              <h3>Health Optimization</h3>
              <ul className={styles.solutionFeatures}>
                <li>Custom dietary analysis</li>
                <li>Weight management plans</li>
                <li>Medical-condition-aware exercise</li>
              </ul>
            </div>
            <div className={styles.solutionCard}>
              <div className={styles.solutionIcon}>🩺</div>
              <h3>Clinical Training</h3>
              <ul className={styles.solutionFeatures}>
                <li>Case diagnosis simulation</li>
                <li>MCQ exam preparation</li>
                <li>Instant feedback on decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;