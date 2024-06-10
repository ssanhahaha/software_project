import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Search.css';
const Search = () => {
  const [photos, setPhotos] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/search?keyword=${keyword}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPhotos(data);
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (keyword) {
      fetchSearchResults();
    }
  }, [keyword]);

  return (
    <body className='search'>
    <div class="container">
      <h1>검색 결과</h1>
      <div className="photo-container">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img src={`/static/uploads/${photo.filename}`} alt={photo.description} />
            <p><strong>설명:</strong> {photo.description}</p>
            <p><strong>키워드:</strong> {photo.keywords}</p>
            <p><strong>작성자:</strong> {photo.username}</p>
          </div>
        ))}
      </div>
      <Link to="/home">홈으로</Link>
    </div>
    
    </body>
  );
};

export default Search;


