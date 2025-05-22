import { useEffect, useRef } from 'react';
import styles from '../styles/Hero.module.css';

const Hero: React.FC = () => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null); // Changed NodeJS.Timeout to number

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    const animateCounter = (element: HTMLElement, target: number, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(timer);
          current = target;
        }
        element.textContent = Math.floor(current).toLocaleString();
      }, 16);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const finalValue = parseInt(target.getAttribute('data-target') || '0');
            animateCounter(target, finalValue);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const studentsCount = document.getElementById('studentsCount');
    const diagnosesCount = document.getElementById('diagnosesCount');
    const questionsCount = document.getElementById('questionsCount');

    if (studentsCount) observer.observe(studentsCount);
    if (diagnosesCount) observer.observe(diagnosesCount);
    if (questionsCount) observer.observe(questionsCount);

    const demoConversation: { type: string; content: string; delay: number }[] = [
      { type: 'ai', content: 'Hello! I’m Smart Doctor AI. How can I assist you today?', delay: 2000 },
      { type: 'user', content: 'I’m feeling tired and want to lose weight.', delay: 2000 },
      { type: 'ai', content: 'Fatigue may indicate several conditions. Let’s analyze your diet. What do you eat daily?', delay: 3000 },
      { type: 'user', content: 'Mostly fast food and sugary drinks.', delay: 2000 },
      { type: 'ai', content: 'Switch to a low-carb, high-protein diet with vegetables. Try 30 minutes of brisk walking daily. Want an MCQ to practice?', delay: 3000 },
      { type: 'user', content: 'Yes, give me an MCQ.', delay: 2000 },
      { type: 'ai', content: 'Question: What is a symptom of hypothyroidism? A) Weight loss B) Fatigue C) Fever D) Hypertension', delay: 3000 },
    ];

    const addMessage = (content: string, type: string) => {
      const children = chatMessages.children as HTMLCollectionOf<HTMLElement>;
      const existingMessages = Array.from(children).map((child) => child.textContent || '');
      if (existingMessages.includes(content)) return;
      const messageDiv = document.createElement('div');
      messageDiv.className = `${styles.message} ${styles[`${type}Message`]}`;
      messageDiv.textContent = content;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTypingIndicator = () => {
      const typingDiv = document.createElement('div');
      typingDiv.className = styles.typingIndicator;
      typingDiv.innerHTML = `
        <div class="${styles.typingDot}"></div>
        <div class="${styles.typingDot}"></div>
        <div class="${styles.typingDot}"></div>
      `;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return typingDiv;
    };

    const removeTypingIndicator = (typingDiv: HTMLElement | null) => {
      if (typingDiv) typingDiv.remove();
    };

    const playConversation = () => {
      chatMessages.innerHTML = '';
      let currentIndex = 0;

      const displayNextMessage = () => {
        if (currentIndex >= demoConversation.length) {
          timeoutRef.current = setTimeout(playConversation, 5000);
          return;
        }

        const message = demoConversation[currentIndex];

        if (message.type === 'ai') {
          const typingDiv = showTypingIndicator();
          timeoutRef.current = setTimeout(() => {
            removeTypingIndicator(typingDiv);
            addMessage(message.content, message.type);
            currentIndex++;
            timeoutRef.current = setTimeout(displayNextMessage, message.delay);
          }, 1000);
        } else {
          addMessage(message.content, message.type);
          currentIndex++;
          timeoutRef.current = setTimeout(displayNextMessage, message.delay);
        }
      };

      displayNextMessage();
    };

    playConversation();

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <section className={styles.hero} id="home">
      <div className={styles.container}>
        <div className={styles.heroWrapper}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Empower Your Health with <span>Smart Doctor AI</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Chat with Smart Doctor AI for accurate medical diagnosis, personalized diet and exercise plans to achieve your weight goals, and timed MCQ practice to help medical and dental students excel in exams.
            </p>
            <div className={styles.heroBtns}>
              <a href="#demo" className={styles.btn}>Try Demo</a>
              <a href="#how-it-works" className={`${styles.btn} ${styles.btnOutline}`}>Learn More</a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber} id="studentsCount" data-target="12500">0</div>
                <div className={styles.statLabel}>Medical Students</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber} id="diagnosesCount" data-target="84000">0</div>
                <div className={styles.statLabel}>Diagnoses Assisted</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber} id="questionsCount" data-target="500">0</div>
                <div className={styles.statLabel}>Exam Questions</div>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.chatWindow}>
              <div className={styles.chatInterface}>
                <div className={styles.chatHeader}>
                  {/* Ensure Font Awesome CDN is included in your HTML: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> */}
                  <i className="fas fa-robot"></i>
                  <h3>Smart Doctor AI</h3>
                </div>
                <div className={styles.chatMessages} id="chatMessages" ref={chatMessagesRef}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;