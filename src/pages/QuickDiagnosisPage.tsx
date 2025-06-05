import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/QuickDiagnosisPage.css';
import { API_BASE_URL } from '../config/config';
import { jsPDF } from 'jspdf';

interface Diagnosis {
  name: string;
  explanation: string;
  treatmentPlan: string;
}

interface QuickDiagnosisRequest {
  presentingComplaint: string;
  associatedSymptoms: string;
  onset: string;
  duration: string;
  additionalInformation: string;
  otherMedicalOrDentalInformation: string;
}

interface QuickDiagnosisResponse {
  diagnoses: Diagnosis[];
}

const QuickDiagnosisPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<QuickDiagnosisRequest>({
    presentingComplaint: '',
    associatedSymptoms: '',
    onset: '',
    duration: '',
    additionalInformation: '',
    otherMedicalOrDentalInformation: '',
  });
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomTags, setSymptomTags] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<QuickDiagnosisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSymptomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymptomInput(e.target.value);
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setSymptomTags((prev) => [...prev, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (index: number) => {
    const updatedTags = symptomTags.filter((_, i) => i !== index);
    setSymptomTags(updatedTags);
    setFormData((prev) => ({
      ...prev,
      associatedSymptoms: updatedTags.join(', '),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.presentingComplaint.trim()) {
      setError('Please enter the presenting complaint.');
      return;
    }

    // Combine symptomTags and current symptomInput for associatedSymptoms
    const allSymptoms = [...symptomTags];
    if (symptomInput.trim()) {
      allSymptoms.push(symptomInput.trim());
    }
    const associatedSymptoms = allSymptoms.join(', ');

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/HealthAI/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user!.token}`,
          'accept': '*/*',
        },
        body: JSON.stringify({
          ...formData,
          associatedSymptoms,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch diagnosis.');
      }

      const data: QuickDiagnosisResponse = await response.json();
      setDiagnosis(data);
      setFormData((prev) => ({
        ...prev,
        associatedSymptoms,
      }));
    } catch (err) {
      console.error('Error fetching quick diagnosis:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      presentingComplaint: '',
      associatedSymptoms: '',
      onset: '',
      duration: '',
      additionalInformation: '',
      otherMedicalOrDentalInformation: '',
    });
    setSymptomTags([]);
    setSymptomInput('');
    setDiagnosis(null);
    setError(null);
  };

  const handleDownloadPDF = () => {
    if (!diagnosis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const lineHeight = 5;
    let yPosition = margin;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 198, 255); // --primary (#00c6ff)
    doc.text('Smart Doctor AI', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    // Title
    doc.setFontSize(12);
    doc.setTextColor(0, 114, 255); // --secondary (#0072ff)
    doc.text('Quick Diagnosis Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Warning
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(220, 53, 69); // Red for warning
    const warningText = 'Warning: Smart Doctor AI is not a replacement for a physical doctor. Please contact your clinician for further examination.';
    const warningLines = doc.splitTextToSize(warningText, pageWidth - 2 * margin);
    doc.text(warningLines, margin, yPosition);
    yPosition += warningLines.length * lineHeight + 3;

    // Diagnoses
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black for content
    doc.setFont('helvetica', 'bold');
    doc.text('Differential Diagnoses:', margin, yPosition);
    yPosition += lineHeight + 1;

    diagnosis.diagnoses.forEach((d, index) => {
      // Diagnosis Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 198, 255); // --primary
      const nameText = `${index + 1}. ${d.name}`;
      doc.text(nameText, margin, yPosition);
      yPosition += lineHeight;

      // Explanation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      const explanationText = `Explanation: ${d.explanation}`;
      const explanationLines = doc.splitTextToSize(explanationText, pageWidth - 2 * margin - 6);
      doc.text(explanationLines, margin + 3, yPosition);
      yPosition += explanationLines.length * lineHeight;

      // Treatment Plan
      const treatmentText = `Treatment Plan: ${d.treatmentPlan}`;
      const treatmentLines = doc.splitTextToSize(treatmentText, pageWidth - 2 * margin - 6);
      doc.text(treatmentLines, margin + 3, yPosition);
      yPosition += treatmentLines.length * lineHeight + 4;
    });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Generated on ${date}`, pageWidth / 2, pageHeight - 8, {
      align: 'center',
    });

    // Save the PDF
    doc.save('SmartDoctorAI_Diagnosis_Report.pdf');
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="quick-diagnosis-page">
      <Navbar />
      <div className="quick-diagnosis-content">
        <div className="quick-diagnosis-card">
          <h2 className="quick-diagnosis-title">Quick Diagnosis</h2>
          <form onSubmit={handleSubmit} className="diagnosis-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="presentingComplaint">
                  Presenting Complaint <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="presentingComplaint"
                  name="presentingComplaint"
                  value={formData.presentingComplaint}
                  onChange={handleInputChange}
                  placeholder="e.g., headache"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="associatedSymptoms">Associated Symptoms</label>
                <div className="symptom-input-group">
                  <input
                    type="text"
                    id="associatedSymptoms"
                    value={symptomInput}
                    onChange={handleSymptomInputChange}
                    placeholder="e.g., lightheadedness"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    disabled={isLoading || !symptomInput.trim()}
                    className="add-symptom-button"
                  >
                    +
                  </button>
                </div>
                <div className="symptom-tags">
                  {symptomTags.map((tag, index) => (
                    <span key={index} className="symptom-tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(index)}
                        disabled={isLoading}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="onset">Onset</label>
                <input
                  type="text"
                  id="onset"
                  name="onset"
                  value={formData.onset}
                  onChange={handleInputChange}
                  placeholder="e.g., gradual..."
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 months"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="additionalInformation">Additional Information</label>
                <textarea
                  id="additionalInformation"
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleInputChange}
                  placeholder="Any additional details..."
                  disabled={isLoading}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="otherMedicalOrDentalInformation">Medical/Dental History</label>
                <textarea
                  id="otherMedicalOrDentalInformation"
                  name="otherMedicalOrDentalInformation"
                  value={formData.otherMedicalOrDentalInformation}
                  onChange={handleInputChange}
                  disabled={isLoading}
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
                disabled={isLoading || !formData.presentingComplaint.trim()}
                className="submit-button"
              >
                {isLoading ? (
                  <span className="loading-dots">Diagnosing<span className="dots">...</span></span>
                ) : (
                  'Get Diagnosis'
                )}
              </button>
            </div>
          </form>
        </div>
        {diagnosis && (
          <div className="diagnosis-results-card">
            <h3 className="results-title">Diagnosis Results</h3>
            <p className="warning">
              <strong>Warning:</strong> Smart Doctor AI is not a replacement for a physical doctor. Please contact your clinician for further examination.
            </p>
            <ul className="diagnosis-list">
              {diagnosis.diagnoses.map((d: Diagnosis, i: number) => (
                <li key={i} className="diagnosis-item">
                  <strong className="diagnosis-name">{i + 1}. {d.name}</strong>
                  <p className="diagnosis-explanation">
                    <strong>Explanation:</strong> {d.explanation}
                  </p>
                  <p className="diagnosis-treatment">
                    <strong>Treatment Plan:</strong> {d.treatmentPlan}
                  </p>
                </li>
              ))}
            </ul>
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

export default QuickDiagnosisPage;