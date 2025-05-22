import { useState } from 'react';
import styles from '../styles/FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How accurate is the medical information provided by Smart Doctor AI?',
    answer: 'Smart Doctor AI is trained on up-to-date medical literature, guidelines, and textbooks. While it provides accurate information based on current evidence, it’s designed to assist rather than replace professional medical judgment. Always consult with a licensed healthcare provider for personal medical advice.',
  },
  {
    question: 'Is my personal health data secure?',
    answer: 'Yes, we use bank-level encryption and comply with all relevant data protection regulations (HIPAA, GDPR). Your data is never shared with third parties without your explicit consent.',
  },
  {
    question: 'Can I use Smart Doctor AI for board exam preparation?',
    answer: 'Absolutely! Our exam preparation module includes high-yield questions for USMLE, COMLEX, and other major medical board exams. The AI can tailor questions to your weak areas and provide detailed explanations.',
  },
  {
    question: 'How does the AI differ from standard medical search engines?',
    answer: 'Unlike search engines that return lists of links, our AI understands context, provides synthesized answers, and can walk you through clinical reasoning processes. It’s interactive and adapts to your level of understanding.',
  },
  {
    question: 'What if I encounter a bug or have a feature request?',
    answer: 'We welcome feedback! You can report issues or suggest features through the in-app feedback system. Our team regularly reviews all submissions and prioritizes improvements based on user needs.',
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <p className={styles.sectionSubtitle}>
          Find answers to common questions about Smart Doctor AI.
        </p>
        <div className={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            >
              <div className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                <span>{item.question}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;