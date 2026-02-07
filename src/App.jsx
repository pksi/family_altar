import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Music, BookOpen, History, PlayCircle, ExternalLink, RefreshCw } from 'lucide-react';
import worshipData from './data/worship_music.json';
import bibleData from './data/bible_stories.json';
import './App.css';

const STORAGE_KEYS = {
  HISTORY: 'family_alter_history',
  STORY_INDEX: 'family_alter_story_index'
};

function App() {
  const [currentWorship, setCurrentWorship] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedStoryIndex = localStorage.getItem(STORAGE_KEYS.STORY_INDEX);

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedStoryIndex) setCurrentStoryIndex(parseInt(savedStoryIndex, 10));

    pickRandomWorship();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORY_INDEX, currentStoryIndex.toString());
  }, [currentStoryIndex]);

  const pickRandomWorship = () => {
    if (worshipData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * worshipData.length);
    setCurrentWorship(worshipData[randomIndex]);
  };

  const handleNewSession = () => {
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    pickRandomWorship();
    const randomWorshipIndex = Math.floor(Math.random() * worshipData.length);
    const nextWorship = worshipData[randomWorshipIndex]; // Pick fresh
    setCurrentWorship(nextWorship);

    const nextStoryIndex = (currentStoryIndex + 1) % bibleData.length;
    setCurrentStoryIndex(nextStoryIndex);
    const nextStory = bibleData[nextStoryIndex];

    const newRecord = {
      id: Date.now(),
      date: today,
      worship: nextWorship.name,
      story: nextStory.title,
      storyNumber: nextStory.number
    };

    setHistory(prev => [newRecord, ...prev]);
  };

  const currentStory = bibleData[currentStoryIndex % bibleData.length] || { title: 'Loading...', number: 0 };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon-bg">
            <Sparkles className="icon-gold" />
          </div>
          <h1 className="app-title">Family Alter</h1>
        </div>
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="history-button"
          title="History"
        >
          <History className="icon-slate" />
          {history.length > 0 && <span className="notification-dot"></span>}
        </button>
      </header>

      <main className="app-main">
        {/* Worship Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="content-card"
        >
          <div className="card-header header-gold">
            <Music className="icon-sm" />
            <h2>Worship Music</h2>
          </div>

          <div className="card-body">
            {currentWorship ? (
              <>
                <h3 className="card-title">{currentWorship.name}</h3>
                <a
                  href={currentWorship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-link"
                >
                  <PlayCircle className="icon-xs" />
                  Listen on YouTube <ExternalLink className="icon-xs" />
                </a>
              </>
            ) : (
              <p className="text-loading">Loading music...</p>
            )}
          </div>
        </motion.div>

        {/* Bible Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="content-card"
        >
          <div className="card-header header-blue">
            <BookOpen className="icon-sm" />
            <h2>Bible Story</h2>
          </div>

          <div className="card-body">
            <div className="story-display">
              <span className="story-number">#{currentStory.number}</span>
              <h3 className="card-title">{currentStory.title}</h3>
            </div>
            <p className="story-subtitle">Beginner's Bible</p>
          </div>
        </motion.div>
      </main>

      {/* Main Action */}
      <motion.div
        className="action-container"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button onClick={handleNewSession} className="new-session-button">
          <div className="button-shininess"></div>
          <RefreshCw className="button-icon" />
          <span>Start New Session</span>
        </button>
      </motion.div>

      {/* History Drawer */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="drawer-overlay"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="drawer-content"
            >
              <div className="drawer-header">
                <h2>
                  <History className="icon-gold" />
                  Past Sessions
                </h2>
                <button onClick={() => setIsHistoryOpen(false)} className="close-button">✕</button>
              </div>

              <div className="history-list">
                {history.length === 0 ? (
                  <p className="empty-history">No history yet.</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-date">{item.date}</div>
                      <div className="history-details">
                        <Music className="icon-gold-dim" />
                        <span>{item.worship}</span>
                        <BookOpen className="icon-blue-dim" />
                        <span>{item.story} (#{item.storyNumber})</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
