import { useState, useEffect } from 'react';
import styles from '../styles/Testimonials.module.css';

interface Testimonial {
  content: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
}

const testimonials: Testimonial[] = [
  {
    content: "Smart Doctor AI has completely transformed how I study medicine. The AI chat helps me work through complex cases and the exam questions are incredibly high-yield. It's like having a personal tutor available 24/7.",
    author: {
      name: 'Sarah Johnson',
      title: '3rd Year Medical Student, Harvard',
      avatar: 'https://i.imgur.com/JqYeZRn.jpg',
    },
  },
  {
    content: "As a resident with limited time, Smart Doctor AI helps me quickly refresh concepts and prepare for board exams. The differential diagnosis tool is particularly helpful when I'm on call and need to consider all possibilities.",
    author: {
      name: 'Dr. Michael Chen',
      title: 'Internal Medicine Resident, UCSF',
      avatar: 'https://i.imgur.com/mW5hQ5d.jpg',
    },
  },
  {
    content: "The personalized diet and exercise recommendations have helped me maintain better health during the stressful medical school years. I've recommended Smart Doctor AI to all my classmates!",
    author: {
      name: 'Emily Rodriguez',
      title: '2nd Year Medical Student, Johns Hopkins',
      avatar: 'https://i.imgur.com/3Jf2XxW.jpg',
    },
  },
];

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className={styles.testimonials} id="testimonials">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What Our Users Say</h2>
        <p className={styles.sectionSubtitle}>
          Hear from medical students and professionals who are using Smart Doctor AI.
        </p>
        <div className={styles.testimonialCarousel}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={styles.testimonial}
              style={{ display: index === currentTestimonial ? 'block' : 'none' }}
            >
              <p className={styles.testimonialContent}>{testimonial.content}</p>
              <div className={styles.testimonialAuthor}>
                <img
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  className={styles.authorAvatar}
                />
                <h4 className={styles.authorName}>{testimonial.author.name}</h4>
                <p className={styles.authorTitle}>{testimonial.author.title}</p>
              </div>
            </div>
          ))}
          <div className={styles.carouselNav}>
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`${styles.carouselDot} ${index === currentTestimonial ? styles.active : ''}`}
                onClick={() => handleDotClick(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;