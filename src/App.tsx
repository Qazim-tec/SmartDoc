import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import FAQPage from './pages/FAQPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import Navbar from './components/Navbar';
import QuickDiagnosisPage from './pages/QuickDiagnosisPage';
import DietaryPage from './pages/DietaryPage';
import QuizPage from './pages/QuizPage';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import './styles/global.css';

const App: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/quick-diagnosis" element={<QuickDiagnosisPage />} />
            <Route path="/dietary-plan" element={<DietaryPage />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Routes>
        </div>
        <Footer />
        <BackToTop />
      </Router>
    </AuthProvider>
  );
};

export default App;