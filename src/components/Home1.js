import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home1.css'
const Home1 = () => {
  const [photos, setPhotos] = useState([]); // eslint-disable-line no-unused-vars
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/home', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos);
          setUsers(data.users);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchHomeData();
  }, []);

  const handleKeywordChange = (e) => setKeyword(e.target.value);
  const handleSearch = () => navigate(`/search1?keyword=${keyword}`);

  return (
    <body className="home1">
      <div className="container">
        <h1>A Photo Diary!!</h1>
        <div className="button-group">
        <button onClick={() => navigate('/login')}>로그인</button>
        <button onClick={() => navigate('/register')}>회원가입</button>
        </div>
        <h2>사진 검색</h2>
        <div className="form-group">
          <label htmlFor="keyword">키워드:</label>
          <input type="text" id="keyword" value={keyword} onChange={handleKeywordChange} required />
          <button onClick={handleSearch} className="search-button">검색</button>
        </div>
      
      <h2>사용자 목록</h2>
      <table border="2">
        <thead>
          <tr>
            <th>순번</th>
            <th>사용자 이름</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </body>
  );
};

export default Home1;
