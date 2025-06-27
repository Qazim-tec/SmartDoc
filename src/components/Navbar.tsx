import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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

  const getUserInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName.charAt(0).toUpperCase();
    const lastInitial = user.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.logo}>
          <i className="fas fa-robot"></i>
          <span>SmartDoctor</span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/quick-diagnosis">Quick Diagnosis</Link>
          <Link to="/dietary-plan">Dietary Plan</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/about">About Us</Link>
          <Link to="/faq">FAQ</Link>
          {user ? (
            <div className={`${styles.btn} ${styles.userInitials}`}>
              <span>{getUserInitials()}</span>
              <button onClick={logout} className={styles.logoutBtn}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          ) : (
            <Link to="/signin" className={`${styles.btn} ${styles.signIn}`}>
              <i className="fas fa-sign-in-alt"></i> Sign In
            </Link>
          )}
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
              <Link to="/" onClick={toggleMenu}>Home</Link>
              <Link to="/about" onClick={toggleMenu}>About Us</Link>
              <Link to="/chat" onClick={toggleMenu}>Chat</Link>
              <Link to="/quick-diagnosis" onClick={toggleMenu}>Quick Diagnosis</Link>
              <Link to="/dietary-plan" onClick={toggleMenu}>Dietary Plan</Link>
              <Link to="/quiz" onClick={toggleMenu}>Quiz</Link>
              <Link to="/faq" onClick={toggleMenu}>FAQ</Link>
             
            </div>
            {user ? (
              <div className={`${styles.mobileSignIn} ${styles.btn}`} onClick={toggleMenu}>
                <span>{getUserInitials()}</span>
                <button onClick={logout} className={styles.logoutBtn}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            ) : (
              <Link to="/signin" className={`${styles.mobileSignIn} ${styles.btn}`} onClick={toggleMenu}>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;