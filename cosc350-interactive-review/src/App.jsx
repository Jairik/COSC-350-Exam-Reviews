import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TopicReview from './components/TopicReview';
import MockFinal from './components/MockFinal';
import topicsData from './data/topics.json';
import mockFinalData from './data/mockFinal.json';
import { ArrowLeft, Sun, Moon } from './components/Icons';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Default to Light Mode as indicated in the plan (unless toggled)
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navigateToTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentView('topic');
    window.scrollTo(0,0);
  };

  const navigateToMock = () => {
    setCurrentView('mock');
    window.scrollTo(0,0);
  };

  const navigateToDashboard = () => {
    setSelectedTopic(null);
    setCurrentView('dashboard');
    window.scrollTo(0,0);
  };

  return (
    <>
      <nav className="nav-glass">
        <div>
          {currentView !== 'dashboard' && (
            <button className="btn-tertiary" onClick={navigateToDashboard}>
              <ArrowLeft /> Back
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            onClick={() => {
              localStorage.removeItem('cosc350-topic-answers');
              localStorage.removeItem('cosc350-mock-answers');
              window.location.reload();
            }}
          >
            Clear Progress
          </button>
          <button 
            className="btn-tertiary" 
            onClick={toggleTheme} 
            style={{ padding: '0.5rem', background: 'var(--surface-container-high)', borderRadius: 'var(--radius-sm)' }}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </nav>

      <div className="app-container">
        {currentView === 'dashboard' && (
          <Dashboard 
            topics={topicsData} 
            mockQuestions={mockFinalData}
            onSelectTopic={navigateToTopic} 
            onSelectMock={navigateToMock} 
          />
        )}

        {currentView === 'topic' && selectedTopic && (
          <TopicReview topic={selectedTopic} />
        )}

        {currentView === 'mock' && (
          <MockFinal questions={mockFinalData} />
        )}
      </div>

      <footer className="site-footer">
        <span>Made by JJ McCauley — 2026</span>
        <a href="https://github.com/Jairik/COSC-350-Exam-Reviews" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </footer>
    </>
  );
}

export default App;
