import React from 'react';
import { BookOpen, Award, ChevronRight } from './Icons';

const TOPIC_KEY = 'cosc350-topic-answers';
const MOCK_KEY = 'cosc350-mock-answers';

function getStoredAnswers(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); }
  catch { return {}; }
}

function getTopicScore(topic) {
  const all = getStoredAnswers(TOPIC_KEY);
  const saved = all[topic.title] || {};
  const mc = topic.questions.filter(q => q.type === 'mc');
  let correct = 0, answered = 0;
  mc.forEach(q => {
    const idx = topic.questions.indexOf(q);
    if (saved[idx] !== undefined) {
      answered++;
      if (saved[idx] === q.answer) correct++;
    }
  });
  return { correct, answered, total: mc.length };
}

function Dashboard({ topics, mockQuestions, onSelectTopic, onSelectMock }) {
  // Mock final score
  const mockSaved = getStoredAnswers(MOCK_KEY);
  const mockMC = (mockQuestions || []).filter(q => q.type === 'mc');
  let mockCorrect = 0, mockAnswered = 0;
  mockMC.forEach((q, i) => {
    const idx = (mockQuestions || []).indexOf(q);
    if (mockSaved[idx] !== undefined) {
      mockAnswered++;
      if (mockSaved[idx] === q.answer) mockCorrect++;
    }
  });

  return (
    <div className="fade-in">
      <header className="header">
        <h1 className="header-title gradient-text">COSC350 Final Review</h1>
        <p className="header-subtitle">
          Walk through every topic, then test yourself with the mock final.
        </p>
      </header>

      <div className="dashboard">
        <section className="dashboard-section">
          <h2><Award /> Final Preparation</h2>
          <div className="mock-final-card interactive-card" onClick={onSelectMock} style={{ cursor: 'pointer' }}>
            <div>
              <h3>Cumulative Mock Final</h3>
              <p>25 questions covering all lecture notes.</p>
              {mockAnswered > 0 && (
                <div className="card-score" style={{ marginTop: '0.75rem', opacity: 0.9 }}>
                  ✓ {mockCorrect}/{mockMC.length} correct
                </div>
              )}
            </div>
            <button className="btn-primary" style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}>
              {mockAnswered > 0 ? 'Continue' : 'Begin'}
            </button>
          </div>
        </section>

        <section className="dashboard-section">
          <h2><BookOpen /> Topic Reviews</h2>
          <div className="topics-grid">
            {topics.map((topic, index) => {
              const score = getTopicScore(topic);
              return (
                <div 
                  key={index} 
                  className="interactive-card"
                  onClick={() => onSelectTopic(topic)}
                >
                  <div className="topic-title">{topic.title}</div>
                  <div className="topic-stats">
                    <span className="stat-badge">{topic.questions.length} Questions</span>
                    {score.answered > 0 && (
                      <span className="card-score" style={{ marginLeft: '0.5rem' }}>
                        ✓ {score.correct}/{score.total}
                      </span>
                    )}
                    <ChevronRight style={{ marginLeft: 'auto', color: 'var(--outline-variant)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
