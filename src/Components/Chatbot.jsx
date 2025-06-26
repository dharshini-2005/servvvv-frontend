import React, { useState, useEffect, useRef } from 'react';
import trainingData from '../data/chatbotTrainingData.json';
import '../Styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    trainingData.forEach(item => {
      const score = item.questions.reduce((maxScore, question) => {
        const questionWords = question.toLowerCase().split(' ');
        const inputWords = input.split(' ');
        const matchingWords = questionWords.filter(word => inputWords.includes(word));
        const currentScore = matchingWords.length / questionWords.length;
        return Math.max(maxScore, currentScore);
      }, 0);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    return highestScore > 0.3 ? bestMatch : null;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    // Find best matching response
    const match = findBestMatch(input);
    
    // Add bot response
    setMessages(prev => [...prev, { 
      text: match ? match.answer : "I'm sorry, I don't understand that question. Please try asking something else.",
      sender: 'bot' 
    }]);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          💬 Need Help?
        </button>
      )}
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>ServEase Assistant</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
