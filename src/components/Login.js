import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.username);
        navigate('/messages');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Failed to fetch', error);
    }
  };

  return (
  <body className="login">
    <div className ="login-container">
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
        <label htmlFor="username">이름:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
        <label htmlFor="password">비밀번호:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">로그인</button>
      </form>
      <div className="link-container">
      <Link to="/register">회원가입</Link>
      </div>
    </div>
  </body>
  );
};

export default Login;

