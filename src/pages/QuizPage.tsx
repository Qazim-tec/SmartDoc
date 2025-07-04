import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/QuizPage.css';
import { API_BASE_URL } from '../config/config';
import { jsPDF } from 'jspdf';

interface Category {
  id: number;
  name: string;
  isMedical: boolean;
}

interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface Answer {
  [key: string]: string; // e.g., { "1": "A", "2": "B" }
}

interface MissedQuestion {
  text: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  formattedScore: string;
  missedQuestions: MissedQuestion[];
}

const QUIZ_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const QUESTIONS_PER_PAGE = 3;
const TOTAL_QUESTIONS = 50;

const QuizPage: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryType, setCategoryType] = useState<'Medical' | 'Dental' | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_DURATION);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState<boolean>(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Quiz/categories`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${user!.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch categories.');
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchCategories();
  }, [user]);

  // Timer logic
  useEffect(() => {
    if (!quizStarted || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleSubmit(false); // Auto-submit without confirmation
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, result]);

  // Fetch questions when category is selected
  const fetchQuestions = async (categoryId: number) => {
    setIsFetchingQuestions(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Quiz/questions/${categoryId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${user!.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch questions.');
      const data: Question[] = await response.json();
      setQuestions(data.slice(0, TOTAL_QUESTIONS));
      setAnswers({});
      setCurrentPage(0);
      setResult(null);
      setTimeLeft(QUIZ_DURATION);
      setQuizStarted(true);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  // Handle category type selection
  const handleCategoryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'Medical' | 'Dental' | '';
    setCategoryType(type);
    setSelectedCategory(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setQuizStarted(false);
    setIsFetchingQuestions(false);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    fetchQuestions(categoryId);
  };

  // Handle answer selection
  const handleAnswerChange = (questionId: number, option: string) => {
    console.log(`Selecting answer for question ${questionId}: ${option}`); // Debug log
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId.toString()]: option };
      console.log('Updated answers:', newAnswers); // Debug log
      return newAnswers;
    });
  };

  // Clear answer for a question
  const handleClearAnswer = (questionId: number) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId.toString()];
      console.log('Cleared answer for question', questionId, 'New answers:', newAnswers); // Debug log
      return newAnswers;
    });
  };

  // Navigate to question
  const handleQuestionSelect = (questionIndex: number) => {
    const page = Math.floor(questionIndex / QUESTIONS_PER_PAGE);
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Submit quiz
  const handleSubmit = async (requireConfirmation: boolean = true) => {
    if (!selectedCategory) {
      setError('Please select a category.');
      return;
    }
    if (requireConfirmation && Object.keys(answers).length < TOTAL_QUESTIONS) {
      if (!window.confirm('You have unanswered questions. They will be marked as incorrect. Proceed with submission?')) {
        return;
      }
    }
    setIsLoading(true);
    setError(null);
    console.log('Submitting quiz with answers:', answers); // Debug log
    try {
      const response = await fetch(`${API_BASE_URL}/api/Quiz/submit`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${user!.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: selectedCategory,
          answers,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit quiz: ${errorText}`);
      }
      const data: QuizResult = await response.json();
      console.log('Quiz submission response:', data); // Debug log
      setResult(data);
      setQuizStarted(false);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset quiz
  const handleReset = () => {
    setCategoryType('');
    setSelectedCategory(null);
    setQuestions([]);
    setAnswers({});
    setCurrentPage(0);
    setResult(null);
    setError(null);
    setQuizStarted(false);
    setIsFetchingQuestions(false);
    setTimeLeft(QUIZ_DURATION);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    if (!result) return;
    const categoryName = categories.find((c) => c.id === selectedCategory)?.name || 'Unknown';
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 7;
    let yPosition = margin;

    // Helper function to add text with wrapping and page breaks
    const addTextWithWrap = (text: string, x: number, maxWidth: number) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - lineHeight) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, x, yPosition);
        yPosition += lineHeight;
      });
    };

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 198, 255); // --primary (#00c6ff)
    doc.text('Smart Doctor AI', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Title
    doc.setFontSize(14);
    doc.setTextColor(0, 114, 255); // --secondary (#0072ff)
    doc.text('Quiz Results', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Category and Score
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    addTextWithWrap(`Category: ${categoryName}`, margin, pageWidth - 2 * margin);
    addTextWithWrap(`Score: ${result.formattedScore} (${((result.score / result.totalQuestions) * 100).toFixed(0)}%)`, margin, pageWidth - 2 * margin);
    yPosition += lineHeight;

    // Missed Questions
    if (result.missedQuestions.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      addTextWithWrap('Missed Questions:', margin, pageWidth - 2 * margin);
      doc.setFont('helvetica', 'normal');
      result.missedQuestions.forEach((missed, index) => {
        if (yPosition > pageHeight - margin - 4 * lineHeight) {
          doc.addPage();
          yPosition = margin;
        }
        addTextWithWrap(`${index + 1}. ${missed.text}`, margin + 5, pageWidth - 2 * margin - 5);
        addTextWithWrap(`Your Answer: ${missed.userAnswer === 'None' ? 'None (Skipped)' : missed.userAnswer}`, margin + 5, pageWidth - 2 * margin - 5);
        addTextWithWrap(`Correct Answer: ${missed.correctAnswer}`, margin + 5, pageWidth - 2 * margin - 5);
        addTextWithWrap(`Explanation: ${missed.explanation}`, margin + 5, pageWidth - 2 * margin - 5);
        yPosition += lineHeight;
      });
    } else {
      addTextWithWrap('None! Perfect score!', margin, pageWidth - 2 * margin);
    }

    // Encouragement
    doc.setTextColor(0, 198, 255); // --primary
    const encouragement = "Don't give up! Keep pushing to improve your knowledge!";
    addTextWithWrap(encouragement, margin, pageWidth - 2 * margin);
    yPosition += lineHeight;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Generated on ${date}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

    doc.save(`SmartDoctorAI_Quiz_Results_${categoryName.replace(/\s+/g, '_')}.pdf`);
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const filteredCategories = categories.filter((c) => 
    categoryType === 'Medical' ? c.isMedical : categoryType === 'Dental' ? !c.isMedical : false
  );
  const totalPages = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-page">
      <Navbar />
      <div className="quiz-content">
        {!quizStarted && !result && !isFetchingQuestions && (
          <div className="quiz-card">
            <h2 className="quiz-title">Medical Quiz</h2>
            <div className="category-selection">
              <div className="form-group">
                <label htmlFor="categoryType">
                  Category Type <span className="required">*</span>
                </label>
                <select
                  id="categoryType"
                  value={categoryType}
                  onChange={handleCategoryTypeChange}
                  disabled={isLoading}
                  required
                >
                  <option value="">-- Choose a type --</option>
                  <option value="Medical">Medical</option>
                  <option value="Dental">Dental</option>
                </select>
              </div>
              {categoryType && (
                <div className="category-list">
                  <h4>Select a Course</h4>
                  {filteredCategories.length === 0 ? (
                    <p>No courses available.</p>
                  ) : (
                    <div className="category-grid">
                      {filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          disabled={isLoading}
                          className="category-button"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        )}
        {isFetchingQuestions && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
        {quizStarted && !result && (
          <div className="quiz-card">
            <h2 className="quiz-title">
              {categories.find((c) => c.id === selectedCategory)?.name} Quiz
            </h2>
            <div className="timer">
              Time Left: {formatTime(timeLeft)}
            </div>
            <p className="instruction-text">
              Note: You may skip questions. Unanswered questions will be marked as incorrect upon submission.
            </p>
            <div className="question-section">
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="question-card">
                  <p className="question-text">
                    {startIndex + index + 1}. {question.text}
                  </p>
                  <div className="options">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <label key={option} className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id.toString()] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                          disabled={isLoading}
                        />
                        {option}: {question[`option${option}` as keyof Question]}
                      </label>
                    ))}
                    <button
                      onClick={() => handleClearAnswer(question.id)}
                      disabled={isLoading || !answers[question.id.toString()]}
                      className="clear-button"
                    >
                      Clear Answer
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="navigation">
              <div className="page-numbers">
                {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => {
                  const pageOfQuestion = Math.floor(i / QUESTIONS_PER_PAGE);
                  const isCurrentPage = currentPage === pageOfQuestion;
                  const isUnanswered = !answers[questions[i]?.id.toString()];
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuestionSelect(i)}
                      className={`page-button ${isCurrentPage ? 'active' : ''} ${isUnanswered ? 'unanswered' : ''}`}
                      disabled={isLoading}
                      aria-label={`Go to question ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="navigation-buttons">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0 || isLoading}
                  className="nav-button"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1 || isLoading}
                  className="nav-button"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="action-buttons">
              <button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <span className="loading-dots">Submitting<span className="dots">...</span></span>
                ) : (
                  'Submit Quiz'
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="reset-button"
              >
                Reset
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
        {result && (
          <div className="results-card">
            <h3 className="results-title">Quiz Results</h3>
            <p className="score">
              Score: {result.formattedScore} ({((result.score / result.totalQuestions) * 100).toFixed(0)}%)
            </p>
            <div className="missed-questions">
              <h4>Missed Questions</h4>
              {result.missedQuestions.length === 0 ? (
                <p className="perfect-score">None! Perfect score!</p>
              ) : (
                result.missedQuestions.map((missed, index) => (
                  <div key={index} className="missed-question">
                    <p className="missed-text">
                      <span className="question-label">{index + 1}. Question:</span> {missed.text}
                    </p>
                    <p className="missed-answer">
                      <span className="answer-label">Your Answer:</span>{' '}
                      {missed.userAnswer === 'None' ? 'None (Skipped)' : missed.userAnswer}
                    </p>
                    <p className="missed-answer">
                      <span className="answer-label">Correct Answer:</span> {missed.correctAnswer}
                    </p>
                    <p className="missed-explanation">
                      <span className="answer-label">Explanation:</span> {missed.explanation}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="results-actions">
              <button onClick={handleDownloadPDF} className="download-pdf-button">
                Download PDF
              </button>
              <button onClick={handleReset} className="reset-button">
                Take Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;