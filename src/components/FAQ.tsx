import { useState } from 'react';
import styles from '../styles/FAQ.module.css';
import { 
  FiChevronDown, 
  FiChevronUp,
  FiShield,
  FiBook,
  FiCode,
  FiRefreshCw,
  FiMail
} from 'react-icons/fi';
import { FaStethoscope, FaRobot } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: 'How accurate is the medical information provided by Smart Doctor AI?',
      answer: 'Smart Doctor AI is trained on up-to-date medical literature, guidelines, and textbooks. While it provides accurate information based on current evidence, it\'s designed to assist rather than replace professional medical judgment.',
      icon: <FaStethoscope className={styles.faqIcon} />
    },
    {
      question: 'Is my personal health data secure?',
      answer: 'Yes, we use bank-level encryption and comply with all relevant data protection regulations (HIPAA, GDPR). Your data is never shared with third parties without your explicit consent.',
      icon: <FiShield className={styles.faqIcon} />
    },
    {
      question: 'Can I use Smart Doctor AI for board exam preparation?',
      answer: 'Absolutely! Our exam preparation module includes high-yield questions for USMLE, COMLEX, and other major medical board exams. The AI can tailor questions to your weak areas and provide detailed explanations.',
      icon: <FiBook className={styles.faqIcon} />
    },
    {
      question: 'How does the AI differ from standard medical search engines?',
      answer: 'Unlike search engines that return lists of links, our AI understands context, provides synthesized answers, and can walk you through clinical reasoning processes. It\'s interactive and adapts to your level of understanding.',
      icon: <FaRobot className={styles.faqIcon} />
    },
    {
      question: 'What if I encounter a bug or have a feature request?',
      answer: 'We welcome feedback! You can report issues or suggest features through the in-app feedback system. Our team regularly reviews all submissions and prioritizes improvements based on user needs.',
      icon: <FiCode className={styles.faqIcon} />
    },
    {
      question: 'How often is the medical content updated?',
      answer: 'Our content is reviewed and updated quarterly by our medical advisory board, with urgent updates implemented immediately when new guidelines are released.',
      icon: <FiRefreshCw className={styles.faqIcon} />
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <p className={styles.sectionSubtitle}>
          Find answers to common questions about Smart Doctor AI
        </p>
        
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            >
              <button 
                className={styles.questionButton}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className={styles.iconContainer}>{item.icon}</span>
                <span className={styles.questionText}>{item.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className={styles.chevron} />
                ) : (
                  <FiChevronDown className={styles.chevron} />
                )}
              </button>
              
              <div 
                className={styles.answerContainer}
                aria-hidden={activeIndex !== index}
              >
                <div className={styles.answer}>{item.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.contactSection}>
          <div className={styles.contactIcon}>
            <FiMail />
          </div>
          <h3 className={styles.contactTitle}>Still have questions?</h3>
          <p className={styles.contactText}>
            Contact our support team for more information
          </p>
          <a href="/contact" className={styles.contactButton}>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;