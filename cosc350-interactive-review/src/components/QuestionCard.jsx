import React, { useState, useEffect } from 'react';

function formatText(text) {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const code = part.replace(/```[a-z]*\n?|```/g, '');
      return (
        <pre key={i}>
          <code>{code}</code>
        </pre>
      );
    } else if (part.startsWith('`')) {
      return <code key={i}>{part.replace(/`/g, '')}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

function QuestionCard({ question, showAnswer, onAnswer, savedAnswer }) {
  const [selectedLetter, setSelectedLetter] = useState(savedAnswer || null);

  useEffect(() => {
    setSelectedLetter(savedAnswer || null);
  }, [question, savedAnswer]);

  const handleSelect = (letter) => {
    if (showAnswer) return;
    setSelectedLetter(letter);
    if (onAnswer) onAnswer(letter);
  };

  const isComplete = showAnswer;

  return (
    <div className="question-card fade-in">
      <div className="question-type-badge">
        {question.type === 'mc' ? 'Multiple Choice' : question.type === 'sa' ? 'Short Answer' : 'Applied'}
      </div>
      
      <div className="question-text">
        {formatText(question.text)}
      </div>

      {question.type === 'mc' && question.options && (
        <div className="options-list">
          {question.options.map((opt) => {
            let className = 'option-item';
            if (!isComplete) {
              className += ' interactive';
              if (selectedLetter === opt.letter) className += ' selected';
            } else {
              if (opt.letter === question.answer) className += ' correct';
              else if (selectedLetter === opt.letter) className += ' incorrect';
            }

            return (
              <div 
                key={opt.letter} 
                className={className}
                onClick={() => handleSelect(opt.letter)}
              >
                <div className="option-letter">{opt.letter}</div>
                <div className="option-text">{formatText(opt.text)}</div>
              </div>
            );
          })}
        </div>
      )}

      {isComplete && (
        <div className="answer-section">
          <h4>
            {question.type === 'mc' 
              ? (selectedLetter === question.answer 
                  ? `✓ Correct — ${question.answer}` 
                  : `✗ Incorrect — Correct answer: ${question.answer}`)
              : "Answer Revealed"}
          </h4>
          {question.explanation && (
            <div className="explanation-text">
              {formatText(question.explanation)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
