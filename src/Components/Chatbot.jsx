import React, { useState, useEffect, useRef } from 'react';
import trainingData from '../data/chatbotTrainingData.json';
import '../Styles/Chatbot.css';

const WELCOME = "👋 Hi! I'm the ServiceX Assistant. Ask me anything about our services, booking, pricing or support!";

/* Levenshtein distance for typo tolerance */
const levenshtein = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
};

/* fuzzy word similarity: 1.0 = identical, 0 = very different */
const wordSim = (a, b) => {
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.max(0, 1 - dist / maxLen);
};

const findBestMatch = (userInput) => {
  const input = userInput.toLowerCase().trim();
  const inWords = input.split(/\s+/);
  let bestMatch = null;
  let highestScore = 0;

  trainingData.forEach(item => {
    item.questions.forEach(question => {
      const q = question.toLowerCase();
      const qWords = q.split(/\s+/);

      // 1. exact substring
      if (input.includes(q) || q.includes(input)) {
        if (0.95 > highestScore) { highestScore = 0.95; bestMatch = item; }
        return;
      }

      // 2. fuzzy word-level matching
      let totalSim = 0;
      inWords.forEach(iw => {
        const best = qWords.reduce((max, qw) => Math.max(max, wordSim(iw, qw)), 0);
        totalSim += best;
      });
      const score = totalSim / Math.max(inWords.length, qWords.length);
      if (score > highestScore) { highestScore = score; bestMatch = item; }
    });
  });

  return highestScore >= 0.35 ? bestMatch : null;
};

const Chatbot = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const messagesEndRef          = useRef(null);

  /* scroll to bottom whenever messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* welcome message when chat opens */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: WELCOME, sender: 'bot' }]);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInput('');
    setTyping(true);

    /* simulate a short typing delay */
    setTimeout(() => {
      const match = findBestMatch(text);
      setMessages(prev => [
        ...prev,
        {
          text: match
            ? match.answer
            : "I'm sorry, I didn't quite understand that. 🤔 Try asking about our services, booking, pricing or support!",
          sender: 'bot',
        },
      ]);
      setTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSend(); };

  /* quick reply chips */
  const chips = ['Services', 'How to book', 'Pricing', 'Contact support'];
  const handleChip = (chip) => {
    setInput(chip);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: chip, sender: 'user' }]);
      setTyping(true);
      setTimeout(() => {
        const match = findBestMatch(chip);
        setMessages(prev => [
          ...prev,
          { text: match ? match.answer : "Let me connect you to a human agent.", sender: 'bot' },
        ]);
        setTyping(false);
      }, 600);
    }, 0);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      {/* Toggle button */}
      {!isOpen && (
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          💬 Need Help?
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">SX</div>
              <div>
                <div className="chatbot-header-name">ServiceX Assistant</div>
                <div className="chatbot-header-status">🟢 Online</div>
              </div>
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <div className="bot-avatar">SX</div>}
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="message bot">
                <div className="bot-avatar">SX</div>
                <div className="message-bubble typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Quick reply chips — show only after welcome */}
            {messages.length === 1 && !typing && (
              <div className="chatbot-chips">
                {chips.map(c => (
                  <button key={c} className="chip-btn" onClick={() => handleChip(c)}>{c}</button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
            />
            <button onClick={handleSend} disabled={!input.trim()}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
