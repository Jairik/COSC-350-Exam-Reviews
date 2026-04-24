import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import { Award } from './Icons';

const STORAGE_KEY = 'cosc350-mock-answers';

function getStoredAnswers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function MockFinal({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => getStoredAnswers());
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Score tracking
  const mcQuestions = questions.filter(q => q.type === 'mc');
  const answeredMC = mcQuestions.filter((q, i) => {
    const idx = questions.indexOf(q);
    return answers[idx] !== undefined;
  });
  const correctCount = mcQuestions.filter(q => {
    const idx = questions.indexOf(q);
    return answers[idx] === q.answer;
  }).length;
  const wrongCount = answeredMC.length - correctCount;

  const handleSelectAnswer = (letter) => {
    const updated = { ...answers, [currentIndex]: letter };
    setAnswers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="results-screen fade-in">
        <Award style={{ width: '80px', height: '80px', color: 'var(--primary)', marginBottom: '1rem' }} />
        <h2>Mock Final Complete</h2>
        <div className="score-display">
          {correctCount} / {mcQuestions.length}
        </div>
        <div className="score-summary" style={{ marginBottom: '1.5rem' }}>
          <span className="score-correct">✓ {correctCount} correct</span>
          <span className="score-wrong">✗ {wrongCount} wrong</span>
          <span className="score-remaining">{mcQuestions.length - answeredMC.length} skipped</span>
        </div>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.2rem', maxWidth: '600px' }}>
          This score reflects the multiple-choice section. Review your short response answers separately. Great work!
        </p>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fade-in session-container">
       <div className="view-header">
        <h2 style={{ marginBottom: 0 }}>Cumulative Mock Final</h2>
        <span className="stat-badge">
          Question {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="score-summary">
        <span className="score-correct">✓ {correctCount} correct</span>
        <span className="score-wrong">✗ {wrongCount} wrong</span>
        <span className="score-remaining">{mcQuestions.length - answeredMC.length} unanswered</span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <QuestionCard 
        question={currentQuestion} 
        showAnswer={showAnswer}
        onAnswer={handleSelectAnswer}
        savedAnswer={answers[currentIndex]}
      />

      <div className="navigation-controls" style={{ justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!showAnswer && (
            <button className="btn-tertiary" onClick={handleSkip}>
              Skip →
            </button>
          )}

          {!showAnswer ? (
            <button className="btn-primary" onClick={handleSubmit}>
              {currentQuestion.type === 'mc' ? 'Submit Answer' : 'Reveal Answer'}
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockFinal;
