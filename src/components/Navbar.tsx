import { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <a href="#" className={styles.logo}>
          <i className="fas fa-robot"></i>
          <span>Smart Doctor AI</span>
        </a>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#demo">Demo</a>
          <a href="#benefits">Benefits</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
          <a href="#signin" className={`${styles.btn} ${styles.signIn}`}>
            <i className="fas fa-sign-in-alt"></i> Sign In
          </a>
        </div>
        <div className={styles.navBtns}>
          <button className={styles.themeToggle} id="themeToggle" onClick={toggleTheme}>
            <i className="fas fa-moon"></i>
          </button>
          <button className={styles.menuToggle} onClick={toggleMenu}>
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`} id="mobileMenu">
          <div className={styles.mobileNavLinks}>
            <div className={styles.topLinks}>
              <a href="#features" onClick={toggleMenu}>Features</a>
              <a href="#how-it-works" onClick={toggleMenu}>How It Works</a>
              <a href="#demo" onClick={toggleMenu}>Demo</a>
              <a href="#benefits" onClick={toggleMenu}>Benefits</a>
              <a href="#testimonials" onClick={toggleMenu}>Testimonials</a>
              <a href="#faq" onClick={toggleMenu}>FAQ</a>
            </div>
            <a href="#signin" className={`${styles.mobileSignIn} ${styles.btn}`} onClick={toggleMenu}>
              <i className="fas fa-sign-in-alt"></i> Sign In
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;