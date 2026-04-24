import React, { useState, useEffect, useRef, useCallback } from 'react';

function formatInline(text) {
  if (!text) return [text];
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
    return <span key={i}>{formatInline(block)}</span>;
  });
}

/* ─── Confetti Burst ─── */
function useConfetti() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.display = 'block';

    const COLORS = [
      '#8A1538', '#FDB913', '#059669', '#c43a66',
      '#fdc94d', '#e0a00e', '#ffffff', '#f472b6',
    ];

    const PARTICLE_COUNT = 60;
    const particles = [];

    // Spawn from center-top area of the card
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 6;
      const size = 4 + Math.random() * 5;
      const shape = Math.random() > 0.5 ? 'rect' : 'circle';
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slight upward bias
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        opacity: 1,
        shape,
        gravity: 0.12 + Math.random() * 0.06,
        friction: 0.98,
      });
    }

    let frame = 0;
    const MAX_FRAMES = 90; // ~1.5 seconds at 60fps

    function draw() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const p of particles) {
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - frame / MAX_FRAMES);

        if (p.opacity <= 0) continue;
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (alive > 0 && frame < MAX_FRAMES) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
      }
    }

    // Cancel any prior animation
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return { canvasRef, fire };
}

function QuestionCard({ question, showAnswer, onAnswer, savedAnswer }) {
  const [selectedLetter, setSelectedLetter] = useState(savedAnswer || null);
  const [prevShowAnswer, setPrevShowAnswer] = useState(showAnswer);
  const { canvasRef, fire } = useConfetti();

  useEffect(() => {
    setSelectedLetter(savedAnswer || null);
  }, [question, savedAnswer]);

  // Fire confetti when answer is revealed and correct
  useEffect(() => {
    if (showAnswer && !prevShowAnswer) {
      if (question.type === 'mc' && selectedLetter === question.answer) {
        // Small delay so the correct highlight renders first
        const t = setTimeout(fire, 150);
        return () => clearTimeout(t);
      }
    }
    setPrevShowAnswer(showAnswer);
  }, [showAnswer]);

  const handleSelect = (letter) => {
    if (showAnswer) return;
    setSelectedLetter(letter);
    if (onAnswer) onAnswer(letter);
  };

  const isComplete = showAnswer;
  const isCorrect = isComplete && question.type === 'mc' && selectedLetter === question.answer;

  return (
    <div className={`question-card fade-in${isCorrect ? ' correct-glow' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Confetti canvas overlaid on top of the card */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          display: 'none',
          zIndex: 10,
        }}
      />

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
