import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

// Types
interface Message {
  id: string;
  enquiry: string;
  response: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ChatHistoryItem {
  id: string;
  preview: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState<'login' | 'register'>('login');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Auth states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE = 'http://localhost:3000'; // Base URL

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const handleRegister = async () => {
    setAuthError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // After registration, auto-login
      await handleLogin();
    } catch (error: any) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setAuthError('');
    setLoading(true);

    try {
      console.log('Calling:', `${API_BASE}/user/login`); // DEBUG
      const response = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login response:', data); // DEBUG

      const userData: User = {
        id: data.user.id,
        name: email.split('@')[0], // Extract name from email or use data.user.name if available
        email: data.user.email,
        createdAt: data.user.createdAt,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    if (!user) return;
    try {
      console.log('Loading history from:', `${API_BASE}/api/chat/history`); // DEBUG
      const response = await fetch(`${API_BASE}/api/chat/history`, {
        credentials: 'include',
      });

      console.log('History response status:', response.status); // DEBUG

      const data = await response.json();

      if (response.ok && data.history) {
        setChatHistory(
          data.history.map((item: any, idx: number) => ({
            id: item.id || `chat-${idx}`,
            preview: item.enquiry?.substring(0, 50) || 'New chat',
            timestamp: new Date(item.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      enquiry: userMessage,
      response: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      console.log('Sending message to:', `${API_BASE}/api/chat`); // DEBUG
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ enquiry: userMessage }),
      });

      console.log('Chat response status:', response.status); // DEBUG

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response');
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, response: data.response, id: data.id || tempId } : msg
        )
      );

      loadChatHistory();
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, response: `Error: ${error.message}` } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setChatHistory([]);
    localStorage.removeItem('user');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!user) {
        showAuth === 'login' ? handleLogin() : handleRegister();
      } else {
        handleSendMessage();
      }
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
        style={{ padding: '20px' }}
      >
        <div
          className="card shadow-lg"
          style={{ width: '100%', maxWidth: '450px', margin: 'auto' }}
        >
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">AI Psychologist</h2>
              <p className="text-muted">Your mental wellness companion</p>
            </div>

            {authError && (
              <div className="alert alert-danger" role="alert">
                {authError}
              </div>
            )}

            <ul className="nav nav-tabs mb-4" role="tablist">
              <li className="nav-item flex-fill">
                <button
                  className={`nav-link w-100 ${showAuth === 'login' ? 'active' : ''}`}
                  onClick={() => setShowAuth('login')}
                >
                  Login
                </button>
              </li>
              <li className="nav-item flex-fill">
                <button
                  className={`nav-link w-100 ${showAuth === 'register' ? 'active' : ''}`}
                  onClick={() => setShowAuth('register')}
                >
                  Register
                </button>
              </li>
            </ul>

            {showAuth === 'register' ? (
              <div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>
                <button
                  onClick={handleRegister}
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                  />
                </div>
                <button onClick={handleLogin} className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light">
      <div
        className={`bg-dark text-white ${showSidebar ? '' : 'd-none'}`}
        style={{ width: '280px', transition: 'all 0.3s' }}
      >
        <div className="d-flex flex-column h-100">
          <div className="p-3 border-bottom border-secondary">
            <button className="btn btn-outline-light w-100 mb-3" onClick={() => setMessages([])}>
              + New Chat
            </button>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <div className="fw-bold">{user.name}</div>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto p-3">
            <h6 className="text-muted text-uppercase small mb-3">Recent Chats</h6>
            {chatHistory.length === 0 ? (
              <p className="text-muted small">No chat history yet</p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="p-2 mb-2 rounded bg-secondary bg-opacity-25"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="small text-truncate">{chat.preview}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {chat.timestamp.toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-top border-secondary">
            <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <div className="bg-white border-bottom p-3 d-flex align-items-center">
          <button
            className="btn btn-link text-dark me-3"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            ☰
          </button>
          <h5 className="mb-0">AI Psychologist</h5>
        </div>

        <div className="flex-grow-1 overflow-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <h3>Welcome, {user.name}!</h3>
              <p>Start a conversation with your AI psychologist</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="d-flex justify-content-end mb-3">
                  <div className="bg-primary text-white rounded p-3" style={{ maxWidth: '70%' }}>
                    {message.enquiry}
                  </div>
                </div>

                {message.response && (
                  <div className="d-flex justify-content-start">
                    <div className="bg-white border rounded p-3" style={{ maxWidth: '70%' }}>
                      {message.response}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="d-flex justify-content-start">
              <div className="bg-white border rounded p-3">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-top p-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyUp={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-primary"
              disabled={loading || !inputMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
