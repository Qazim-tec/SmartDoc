import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DietaryPage.css';
import { API_BASE_URL } from '../config/config';
import { jsPDF } from 'jspdf';

interface Meal {
  description: string;
  quantity: string;
  calories: number;
  calorieReason: string;
}

interface DayPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
}

interface LifestyleResponse {
  weeklyMealPlan: DayPlan[];
  exerciseRoutine: string;
  lifestyleAdvice: string;
}

interface LifestyleRequest {
  ageGroup: string;
  heightCm: number;
  weightKg: number;
  location: string;
  healthGoal: string;
  dietaryRestrictions: string;
  medicalConditions: string;
}

const DietaryPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<LifestyleRequest>({
    ageGroup: '',
    heightCm: 0,
    weightKg: 0,
    location: '',
    healthGoal: '',
    dietaryRestrictions: '',
    medicalConditions: '',
  });
  const [lifestylePlan, setLifestylePlan] = useState<LifestyleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'heightCm' || name === 'weightKg' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicalConditions.trim()) {
      setError('Please enter at least one medical condition.');
      return;
    }
    if (formData.heightCm <= 0 || formData.weightKg <= 0) {
      setError('Height and weight must be positive numbers.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Lifestyle/lifestyle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user!.token}`,
          'accept': 'text/plain',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lifestyle plan.');
      }

      const data: LifestyleResponse = await response.json();
      setLifestylePlan(data);
    } catch (err) {
      console.error('Error fetching lifestyle plan:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ageGroup: '',
      heightCm: 0,
      weightKg: 0,
      location: '',
      healthGoal: '',
      dietaryRestrictions: '',
      medicalConditions: '',
    });
    setLifestylePlan(null);
    setError(null);
  };

  const handleDownloadPDF = () => {
    if (!lifestylePlan) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 4;
    let yPosition = margin;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 198, 255); // --primary (#00c6ff)
    doc.text('Smart Doctor AI', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;

    // Title
    doc.setFontSize(10);
    doc.setTextColor(0, 114, 255); // --secondary (#0072ff)
    doc.text('Weekly Lifestyle Plan', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    // Warning
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(220, 53, 69); // Red for warning
    const warningText = 'Warning: Consult a healthcare professional before making significant dietary or lifestyle changes, especially with medical conditions.';
    const warningLines = doc.splitTextToSize(warningText, pageWidth - 2 * margin);
    doc.text(warningLines, margin, yPosition);
    yPosition += warningLines.length * lineHeight + 2;

    // Weekly Meal Plan Table
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0); // Black for content
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Meal Plan:', margin, yPosition);
    yPosition += lineHeight + 1;

    // Table Headers
    const colWidths = [25, 45, 45, 45, 25]; // Day, Breakfast, Lunch, Dinner, Snacks
    const colPositions = [margin, margin + 25, margin + 70, margin + 115, margin + 160];
    doc.setFontSize(7);
    doc.text('Day', colPositions[0], yPosition);
    doc.text('Breakfast', colPositions[1], yPosition);
    doc.text('Lunch', colPositions[2], yPosition);
    doc.text('Dinner', colPositions[3], yPosition);
    doc.text('Snacks', colPositions[4], yPosition);
    yPosition += lineHeight + 1;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    lifestylePlan.weeklyMealPlan.forEach((day) => {
      const meals = [
        `${day.breakfast.description} (${day.breakfast.quantity}, ${day.breakfast.calories} kcal)\n${day.breakfast.calorieReason}`,
        `${day.lunch.description} (${day.lunch.quantity}, ${day.lunch.calories} kcal)\n${day.lunch.calorieReason}`,
        `${day.dinner.description} (${day.dinner.quantity}, ${day.dinner.calories} kcal)\n${day.dinner.calorieReason}`,
        `${day.snacks.description} (${day.snacks.quantity}, ${day.snacks.calories} kcal)\n${day.snacks.calorieReason}`,
      ];
      doc.text(day.day, colPositions[0], yPosition);
      meals.forEach((meal, i) => {
        const mealLines = doc.splitTextToSize(meal, colWidths[i + 1] - 2);
        doc.text(mealLines, colPositions[i + 1], yPosition);
      });
      yPosition += lineHeight * 4 + 2; // Adjust for multi-line content
    });

    // Exercise Routine
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Exercise Routine:', margin, yPosition);
    yPosition += lineHeight + 1;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const exerciseLines = doc.splitTextToSize(lifestylePlan.exerciseRoutine, pageWidth - 2 * margin);
    doc.text(exerciseLines, margin, yPosition);
    yPosition += exerciseLines.length * lineHeight + 3;

    // Lifestyle Advice
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Lifestyle Advice:', margin, yPosition);
    yPosition += lineHeight + 1;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const adviceLines = doc.splitTextToSize(lifestylePlan.lifestyleAdvice, pageWidth - 2 * margin);
    doc.text(adviceLines, margin, yPosition);
    yPosition += adviceLines.length * lineHeight + 3;

    // Footer
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Generated on ${date}`, pageWidth / 2, pageHeight - 6, {
      align: 'center',
    });

    // Save the PDF
    doc.save('SmartDoctorAI_Lifestyle_Plan.pdf');
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="dietary-page">
      <Navbar />
      <div className="dietary-content">
        <div className="dietary-card">
          <h2 className="dietary-title">Dietary Plan</h2>
          <form onSubmit={handleSubmit} className="dietary-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="ageGroup">Age Group <span className="required">*</span></label>
                <input
                  type="text"
                  id="ageGroup"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  placeholder="e.g., 50 years"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="heightCm">Height (cm) <span className="required">*</span></label>
                <input
                  type="number"
                  id="heightCm"
                  name="heightCm"
                  value={formData.heightCm || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 170"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weightKg">Weight (kg) <span className="required">*</span></label>
                <input
                  type="number"
                  id="weightKg"
                  name="weightKg"
                  value={formData.weightKg || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos, Nigeria"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="healthGoal">Health Goal</label>
                <input
                  type="text"
                  id="healthGoal"
                  name="healthGoal"
                  value={formData.healthGoal}
                  onChange={handleInputChange}
                  placeholder="e.g., Reduce weight"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dietaryRestrictions">Dietary Restrictions</label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="e.g., None, Vegan"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="medicalConditions">
                  Medical Conditions <span className="required">*</span>
                </label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="e.g., Hypertension, Diabetes"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="reset-button"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.medicalConditions.trim()}
                className="submit-button"
              >
                {isLoading ? (
                  <span className="loading-dots">Generating<span className="dots">...</span></span>
                ) : (
                  'Get Plan'
                )}
              </button>
            </div>
          </form>
        </div>
        {lifestylePlan && (
          <div className="results-card">
            <h3 className="results-title">Your Weekly Lifestyle Plan</h3>
            <p className="warning">
              <strong>Warning:</strong> Consult a healthcare professional before making significant dietary or lifestyle changes, especially with medical conditions.
            </p>
            <div className="meal-plan">
              <h4>Weekly Meal Plan</h4>
              {lifestylePlan.weeklyMealPlan.map((day, index) => (
                <div key={index} className="day-plan">
                  <h5>{day.day}</h5>
                  <p className="meal-item">
                    <span className="meal-label">Breakfast:</span> {day.breakfast.description} ({day.breakfast.quantity}, {day.breakfast.calories} kcal). <em>{day.breakfast.calorieReason}</em>
                  </p>
                  <p className="meal-item">
                    <span className="meal-label">Lunch:</span> {day.lunch.description} ({day.lunch.quantity}, {day.lunch.calories} kcal). <em>{day.lunch.calorieReason}</em>
                  </p>
                  <p className="meal-item">
                    <span className="meal-label">Dinner:</span> {day.dinner.description} ({day.dinner.quantity}, {day.dinner.calories} kcal). <em>{day.dinner.calorieReason}</em>
                  </p>
                  <p className="meal-item">
                    <span className="meal-label">Snacks:</span> {day.snacks.description} ({day.snacks.quantity}, {day.snacks.calories} kcal). <em>{day.snacks.calorieReason}</em>
                  </p>
                </div>
              ))}
            </div>
            <div className="exercise-routine">
              <h4>Exercise Routine</h4>
              <p>{lifestylePlan.exerciseRoutine}</p>
            </div>
            <div className="lifestyle-advice">
              <h4>Lifestyle Advice</h4>
              <p>{lifestylePlan.lifestyleAdvice}</p>
            </div>
            <div className="results-actions">
              <button onClick={handleDownloadPDF} className="download-pdf-button">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietaryPage;