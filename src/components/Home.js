import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './home.css';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const { user, setUser } = useContext(UserContext);
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
          console.log('Fetched data:', data);  // 데이터 확인용
          setPhotos(data.photos || []);
          setUsers(data.users || []);
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
  const handleSearch = () => navigate(`/search?keyword=${keyword}`);

  const handleLogout = async () => {
    const response = await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      setUser(null);  // UserContext에서 사용자 상태를 초기화
      navigate('/home1');  // 홈 페이지로 리디렉션
    } else {
      console.error('Failed to logout');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        // 업로드 후 사진 목록을 다시 가져옵니다
        const homeResponse = await fetch('http://localhost:5000/api/home', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (homeResponse.ok) {
          const homeData = await homeResponse.json();
          console.log('Updated photos data:', homeData.photos);  // 데이터 확인용
          setPhotos(homeData.photos || []);
          setUsers(homeData.users || []);
        }
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>{user}의 Photo Diary!!</h1>
      <div className="button-group">
        <button onClick={() => navigate('/messages')}>메시지 목록</button>
        <button onClick={handleLogout}>로그아웃</button>
      </div>

      <h2>사진 업로드</h2>
      <form onSubmit={handleFileUpload} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="file">사진 선택: </label>
          <input type="file" id="file" name="file" />
        </div>
        <div className="form-group">
          <label htmlFor="description">설명:</label>
          <input type="text" id="description" name="description" />
        </div>
        <div className="form-group">
          <label htmlFor="keywords">키워드: </label>
          <input type="text" id="keywords" name="keywords" />
        </div>
        <div class="a">
          <button type="submit">업로드</button>
        </div>
      </form>

      <h2>사진 검색</h2>
      <div className="form-group">
        <label htmlFor="keyword">키워드 검색: </label>
        <input type="text" id="keyword" value={keyword} onChange={handleKeywordChange} required />
      </div>
      <div class="a">
      <button onClick={handleSearch}>검색</button>
      </div>
      <h2>업로드된 사진들</h2>
      <div className="photo-container" >
        {Array.isArray(photos) && photos.map(photo => (
          <div className="photo" key={photo.id}>
            <img src={`/static/uploads/${photo.filename}`} alt={photo.description} style={{ maxWidth: '200px' }} />
            <p>설명: {photo.description}</p>
            <p>키워드: {photo.keywords}</p>
            <p>업로더: {photo.username}</p>
            {photo.username !== user && <Link to={`/messages/${photo.username}`}>메시지 보내기</Link>}
            {photo.username === user && <Link to={`/edit/${photo.id}`}>수정</Link>}
          </div>
        ))}
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
  );
};

export default Home;

