import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

const STORAGE_KEY = 'cosc350-topic-answers';

function getStoredAnswers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function TopicReview({ topic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState(() => {
    const stored = getStoredAnswers();
    return stored[topic.title] || {};
  });

  const currentQuestion = topic.questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / topic.questions.length) * 100;

  // Count right/wrong for MC questions
  const mcQuestions = topic.questions.filter(q => q.type === 'mc');
  const answeredMC = mcQuestions.filter((q, i) => {
    const idx = topic.questions.indexOf(q);
    return answers[idx] !== undefined;
  });
  const correctCount = mcQuestions.filter(q => {
    const idx = topic.questions.indexOf(q);
    return answers[idx] === q.answer;
  }).length;
  const wrongCount = answeredMC.length - correctCount;

  const saveAnswer = (letter) => {
    const updated = { ...answers, [currentIndex]: letter };
    setAnswers(updated);
    // Persist
    const all = getStoredAnswers();
    all[topic.title] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  };

  const handleNext = () => {
    if (currentIndex < topic.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  if (!currentQuestion) return <div>No questions found.</div>;

  return (
    <div className="fade-in session-container">
      <div className="view-header">
        <h2 style={{ marginBottom: 0 }}>{topic.title}</h2>
        <span className="stat-badge">
          Question {currentIndex + 1} / {topic.questions.length}
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
        onAnswer={saveAnswer}
        savedAnswer={answers[currentIndex]}
      />

      <div className="navigation-controls">
        <button 
          className="btn-secondary" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'default' : 'pointer' }}
        >
          Previous
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!showAnswer && currentIndex < topic.questions.length - 1 && (
            <button className="btn-tertiary" onClick={handleSkip}>
              Skip →
            </button>
          )}

          {!showAnswer ? (
            <button className="btn-primary" onClick={handleReveal}>
              Reveal Answer
            </button>
          ) : (
            currentIndex < topic.questions.length - 1 && (
              <button className="btn-primary" onClick={handleNext}>
                Next Question
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default TopicReview;
