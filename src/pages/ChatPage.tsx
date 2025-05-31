import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import '../styles/ChatPage.css';

interface Message {
  role: 'user' | 'assistant' | 'typing' | 'system';
  content: string;
}

interface Diagnosis {
  name: string;
  explanation: string;
  treatmentPlan: string;
}

interface ChatResponse {
  message: string;
  conversationId: string;
  diagnosis: {
    summary: string;
    diagnoses: Diagnosis[];
  } | null;
  isComplete: boolean;
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAudioVideoPrompt, setShowAudioVideoPrompt] = useState(false);
  const [showPDFPrompt, setShowPDFPrompt] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length === 0 && !conversationId && user) {
      startConversation();
    }
  }, [user]);

  const startConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://localhost:7151/api/Chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user!.token}`,
          'accept': '*/*',
        },
        body: JSON.stringify({
          message: '',
          conversationId: null,
          userId: user!.userId,
        }),
      });

      const data: ChatResponse = await response.json();
      setMessages([{ role: 'assistant', content: data.message }]);
      setConversationId(data.conversationId);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setMessages([
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://localhost:7151/api/Chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user!.token}`,
          'accept': '*/*',
        },
        body: JSON.stringify({
          message: input,
          conversationId,
          userId: user!.userId,
        }),
      });

      const data: ChatResponse = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      setConversationId(data.conversationId);

      if (data.isComplete && data.diagnosis !== null) {
        const { summary, diagnoses } = data.diagnosis;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: JSON.stringify({ summary, diagnoses }),
          },
        ]);
        setShowPDFPrompt(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAudioVideo = (confirm: boolean) => {
    if (confirm) {
      window.location.href = 'https://wa.me/+1234567890'; // Replace with your WhatsApp number
    }
    setShowAudioVideoPrompt(false);
  };

  const handlePDFDownload = (confirm: boolean) => {
    if (confirm) {
      const diagnosisMessage = messages.find(
        (msg) => msg.role === 'assistant' && msg.content.startsWith('{"summary":')
      );
      if (diagnosisMessage) {
        const { summary, diagnoses } = JSON.parse(diagnosisMessage.content);
        const doc = new jsPDF();

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor('#00C6FF'); // --primary
        doc.text('Smart Doctor AI Diagnosis Report', 105, 20, { align: 'center' });

        // Warning
        doc.setFontSize(12);
        doc.setTextColor('#DC3545'); // Red
        doc.setFont('helvetica', 'bold');
        doc.text(
          'Warning: Smart Doctor AI is not a replacement for a physical doctor.',
          105,
          30,
          { align: 'center' }
        );
        doc.text(
          'Please contact your clinician for further examination and investigation.',
          105,
          35,
          { align: 'center' }
        );

        // Diagnosis Summary
        doc.setFontSize(14);
        doc.setTextColor('#0072FF'); // --secondary
        doc.setFont('helvetica', 'bold');
        doc.text('Diagnosis Summary', 20, 50);
        doc.setFontSize(12);
        doc.setTextColor('#2D3748'); // --text
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(summary, 170);
        doc.text(summaryLines, 20, 60);

        // Differential Diagnoses
        doc.setFontSize(14);
        doc.setTextColor('#0072FF');
        doc.setFont('helvetica', 'bold');
        doc.text('Differential Diagnoses', 20, 80 + summaryLines.length * 5);

        let yPos = 90 + summaryLines.length * 5;
        diagnoses.forEach((d: Diagnosis, i: number) => {
          doc.setFontSize(12);
          doc.setTextColor('#00C6FF'); // --primary
          doc.setFont('helvetica', 'bold');
          doc.text(`${i + 1}. ${d.name}`, 20, yPos);
          
          doc.setFontSize(10);
          doc.setTextColor('#2D3748'); // --text
          doc.setFont('helvetica', 'normal');
          const explanationLines = doc.splitTextToSize(`Explanation: ${d.explanation}`, 170);
          doc.text(explanationLines, 25, yPos + 5);
          
          const treatmentLines = doc.splitTextToSize(`Treatment Plan: ${d.treatmentPlan}`, 170);
          doc.text(treatmentLines, 25, yPos + 10 + explanationLines.length * 4);
          
          yPos += 15 + (explanationLines.length + treatmentLines.length) * 4;
        });

        doc.save('SmartDoctorAI_Diagnosis.pdf');
      }
    }
    setShowPDFPrompt(false);
    setShowAudioVideoPrompt(true);
  };

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">Chat with Smart Doctor AI</div>
        <div className="chat-body" ref={chatBodyRef}>
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>Start your conversation with Smart Doctor AI.</p>
              <p>Ask about symptoms, diet, exercises, or medical questions!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index}>
                {msg.role === 'typing' ? (
                  <div className="message ai typing">
                    SmartDoctor typing<span className="dots">...</span>
                  </div>
                ) : msg.role === 'assistant' && msg.content.startsWith('{"summary":') ? (
                  <div className="diagnosis">
                    <h3>Diagnosis Summary</h3>
                    <p className="warning">
                      <strong>Warning:</strong> Smart Doctor AI is not a replacement for a physical doctor. Please contact your clinician for further examination.
                    </p>
                    <p>{JSON.parse(msg.content).summary}</p>
                    <h4>Differential Diagnoses:</h4>
                    <ul>
                      {JSON.parse(msg.content).diagnoses.map((d: Diagnosis, i: number) => (
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
                    {showPDFPrompt && (
                      <div className="prompt">
                        <p>Would you like to download a PDF of the diagnosis summary and differential diagnoses?</p>
                        <div className="prompt-buttons">
                          <button onClick={() => handlePDFDownload(true)}>Yes</button>
                          <button onClick={() => handlePDFDownload(false)}>No</button>
                        </div>
                      </div>
                    )}
                    {showAudioVideoPrompt && (
                      <div className="prompt">
                        <p>Would you like to have an audio chat or video call with a doctor?</p>
                        <div className="prompt-buttons">
                          <button onClick={() => handleAudioVideo(true)}>Yes</button>
                          <button onClick={() => handleAudioVideo(false)}>No</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`message ${msg.role}`}>
                    <span className="message-role">
                      {msg.role === 'user' ? 'You' : 'Smart Doctor AI'}:
                    </span>{' '}
                    {msg.content}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="message ai typing">
              SmartDoctor typing<span className="dots">...</span>
            </div>
          )}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;