import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import React, { useState, useRef } from "react";
export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatBoxRef = useRef(null);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleSend = () => {
    const text = input.trim();
    if (text) {
      addMessage("You", text);
      setInput("");
      setTimeout(() => {
        addMessage("Bot", "Hello! I’m your chatbot."); // Replace with AI API call
      }, 500);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)}>Chatbot</button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          id="chatbot-panel"
          style={{
            border: "1px solid #ccc",
            width: "300px",
            height: "400px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Chat Messages */}
          <div
            id="chat-box"
            ref={chatBoxRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              background: "#f9f9f9"
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ display: "flex" }}>
            <input
              id="user-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: "5px" }}
            />
            <button id="send-btn" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
