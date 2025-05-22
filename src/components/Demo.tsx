import { useEffect, useRef } from 'react';
import styles from '../styles/Demo.module.css';

const Demo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const playBtn = playBtnRef.current;

    if (video && playBtn) {
      const togglePlay = () => {
        if (video.paused) {
          video.play();
          playBtn.style.display = 'none';
        } else {
          video.pause();
          playBtn.style.display = 'flex';
        }
      };

      playBtn.addEventListener('click', togglePlay);
      video.addEventListener('click', togglePlay);

      return () => {
        playBtn.removeEventListener('click', togglePlay);
        video.removeEventListener('click', togglePlay);
      };
    }
  }, []);

  return (
    <section className={styles.demo} id="demo">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>See It In Action</h2>
        <p className={styles.sectionSubtitle}>
          Watch how Smart Doctor AI can transform your medical learning experience.
        </p>
        <div className={styles.demoContainer}>
          <div className={styles.demoContent}>
            <h3 className={styles.demoTitle}>Interactive AI Medical Assistant</h3>
            <p className={styles.demoDesc}>
              Our AI understands complex medical queries and provides accurate, evidence-based responses in seconds. Practice your diagnostic skills anytime, anywhere.
            </p>
            <div className={styles.demoFeatures}>
              <div className={styles.demoFeature}>
                <i className="fas fa-check-circle"></i>
                <span>Real-time differential diagnosis</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-check-circle"></i>
                <span>Case-based learning modules</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-check-circle"></i>
                <span>Personalized feedback</span>
              </div>
              <div className={styles.demoFeature}>
                <i className="fas fa-check-circle"></i>
                <span>Reference to latest guidelines</span>
              </div>
            </div>
            <a href="#" className={styles.btn}>Try Free Demo</a>
          </div>
          <div className={styles.demoVideo}>
            <video
              ref={videoRef}
              poster="https://i.imgur.com/JqYeZRn.jpg"
              loop
            >
              <source src="https://example.com/medical-ai-demo.mp4" type="video/mp4" />
            </video>
            <button className={styles.playBtn} ref={playBtnRef}>
              <i className="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;