
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('사용자 이름과 비밀번호를 입력하세요.');
      return;
    }
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || '사용자가 이미 있습니다.');
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <body className="register">
    <div className="container">
      <h1>회원가입</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
            <label htmlFor="username">이름:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="password">비밀번호:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">회원가입</button>
      </form>
        <div className="link-container">
            <Link to="/login">로그인</Link>
        </div>
    </div>
</body>
    // <body className="unique-home2">
    // <div className="container">
    //   <h1>회원가입</h1>
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    //   <form onSubmit={handleRegister}>
    //     <label htmlFor="username">이름:</label>
    //     <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
    //     <br />
    //     <label htmlFor="password">비밀번호:</label>
    //     <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    //     <br />
    //     <button type="submit">회원가입</button>
    //   </form>
    //   <Link to="/login">로그인</Link>
    // </div>
    // </body>
  );
};

export default Register;
