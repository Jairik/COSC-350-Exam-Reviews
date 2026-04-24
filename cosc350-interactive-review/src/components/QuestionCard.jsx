import React, { useState, useEffect } from 'react';

function formatInline(text) {
  if (!text) return [text];
  // Split on **bold**, *italic*, and `code`
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

function formatText(text) {
  if (!text) return null;
  // First split on fenced code blocks
  const blocks = text.split(/(```[\s\S]*?```)/g);
  return blocks.map((block, i) => {
    if (block.startsWith('```')) {
      const code = block.replace(/```[a-z]*\n?|```/g, '');
      return (
        <pre key={i}>
          <code>{code}</code>
        </pre>
      );
    }
    // For non-code blocks, process inline markdown
    return <span key={i}>{formatInline(block)}</span>;
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
