import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal'; // Import the Modal component

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://chat.ransomewatch.online/api";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const messageListRef = useRef(null);

  // Initialize particles on mount
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 80 },
          size: { value: 3 },
          move: { enable: true, speed: 1 },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#00ffcc",
            opacity: 0.4,
            width: 1
          },
          shape: { type: "circle" },
          color: { value: "#00ffcc" },
          opacity: { value: 0.5 }
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    }
  }, []);

  // Load username from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
      setIsModalOpen(false);
    }
  }, []);

  const handleUsernameSubmit = (username) => {
    setUser(username);
    localStorage.setItem('username', username);
    setIsModalOpen(false);
  };

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`);
      const data = await response.json();
      setMessages(data);
      setOnlineUsers(Math.floor(Math.random() * 5) + 2);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user.trim() || !message.trim()) return;

    try {
      await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, message }),
      });

      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  // Fetch messages on mount and poll every 2 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div id="particles-js"></div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleUsernameSubmit} />
      
      <div className="chat-container">
        <div className="chat-header">
          <h2>CHAT ROOM</h2>
          <div className="online-indicator">
            <div className="online-dot"></div>
            <span>{onlineUsers} online</span>
          </div>
        </div>

        <div className="message-list" ref={messageListRef}>
          {messages.map((msg) => (
            <div key={msg._id} className={`message-bubble ${msg.user === user ? 'message-self' : 'message-sender'}`}>
              <div className="message-user">{msg.user}</div>
              <div className="message-text">{msg.message}</div>
              <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        <form className="input-area" onSubmit={sendMessage}>
          <input className="message-input" type="text" placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} required />
          <button className="send-button" type="submit">SEND</button>
        </form>
      </div>
    </>
  );
};

export default ChatRoom;
