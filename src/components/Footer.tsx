import { useRef } from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput.value && emailInput.checkValidity()) {
      alert('Thank you for subscribing to our newsletter!');
      formRef.current?.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContainer}>
          <div className={styles.footerCol}>
            <h3>Smart Doctor AI</h3>
            <p>Revolutionizing medical education through artificial intelligence.</p>
            <div className={styles.footerSocial}>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <h3>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h3>Resources</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Medical Guidelines</a></li>
              <li><a href="#">Research Papers</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h3>Newsletter</h3>
            <p>Subscribe to get updates on new features and medical AI advancements.</p>
            <form className={styles.newsletterForm} onSubmit={handleSubmit} ref={formRef}>
              <input type="email" placeholder="Your Email" required />
              <button type="submit" className={styles.btn}>Subscribe</button>
            </form>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            © 2023 Smart Doctor AI. All rights reserved. | <a href="#">Privacy Policy</a> |{' '}
            <a href="#">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;