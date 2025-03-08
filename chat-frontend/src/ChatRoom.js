// ChatRoom.js
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal'; // Import the Modal component

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser ] = useState('');
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility
  const messageListRef = useRef(null);
  
  // Initialize particles when component mounts
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
            color: "#00ffcc", // Neon color
            opacity: 0.4,
            width: 1
          },
          shape: {
            type: "circle",
          },
          color: {
            value: "#00ffcc"
          },
          opacity: {
            value: 0.5,
            random: false
          }
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
  
  // Check for existing username in local storage
  useEffect(() => {
    const storedUser  = localStorage.getItem('username');
    if (storedUser ) {
      setUser (storedUser );
      setIsModalOpen(false); // Close modal if user is already set
    }
  }, []);
  
  const handleUsernameSubmit = (username) => {
    setUser (username);
    localStorage.setItem('username', username);
    setIsModalOpen(false); // Close the modal after submitting
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/messages');
      const data = await response.json();
      setMessages(data);
      
      // Update online users count (random for demo)
      setOnlineUsers(Math.floor(Math.random() * 5) + 2);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user.trim() || !message.trim()) return;
    
    try {
      await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, message }),
      });
      
      // Clear the message input after sending
      setMessage('');
      
      // Fetch messages to update the list
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Format time for messages
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };
  
  useEffect(() => {
    // Fetch messages on component mount
    fetchMessages();
    
    // Poll for new messages every 2 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []); // Run only once on mount
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);
  
  return (
    <>
      <div id="particles-js"></div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleUsernameSubmit} 
      />
      <div className="chat-container">
        <div className="chat-header">
          <h2>CHAT ROOM</h2>
          <div className="online-indicator">
            <div className="online-dot"></div>
            <span>{onlineUsers} online</span>
          </div>
        </div>
        
        <div className="message-list" ref={messageListRef}>
          {messages.map((msg) => {
            const isCurrentUser  = msg.user === user;
            
            return (
              <div 
                key={msg._id} 
                className={`message-bubble ${isCurrentUser  ? 'message-self' : 'message-sender'}`}
              >
                <div className="message-user">{msg.user}</div>
                <div className="message-text">{msg.message}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            );
          })}
        </div>
        
        <form className="input-area" onSubmit={sendMessage}>
          <input
            className="user-input"
            type="text"
            placeholder="Your name"
            value={user}
            onChange={(e) => setUser (e.target.value)}
            required
            style={{ display: 'none' }} // Hide input for username since it's stored
          />
          <input
            className="message-input"
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button className="send-button" type="submit">SEND</button>
        </form>
      </div>
    </>
  );
};

export default ChatRoom;