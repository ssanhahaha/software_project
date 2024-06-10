
import React, { useState, useEffect } from 'react';
import {Link, useParams, useNavigate } from 'react-router-dom';
import './EditPhoto.css'

const EditPhoto = () => {
  const { photoId } = useParams();
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/photos/${photoId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPhoto(data);
          setDescription(data.description);
          setKeywords(data.keywords);
        } else {
          console.error('Failed to fetch photo', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
      }
    };

    fetchPhoto();
  }, [photoId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditPhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('keywords', keywords);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/photos/${photoId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        alert('사진 정보를 수정했습니다.');
        navigate('/home');
      } else {
        console.error('Failed to edit photo', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error editing photo:', error);
    }
  };

  return (
    <body className="edit">
    <div className="container">
      <h1>사진 수정</h1>
      {photo && (
        <div>
          <img src={`/static/uploads/${photo.filename}`} alt={photo.description} style={{ maxWidth: '200px' }} />
        </div>
      )}
      <form onSubmit={handleEditPhoto}>
      <div className="form-group">
      <label htmlFor="file">파일:</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
        />
        </div>
        <div className="form-group">
        <label htmlFor="description">설명:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        </div>
        <div className="form-group">
        <label htmlFor="keywords">키워드:</label>
        <input
          type="text"
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
        </div>
        <button type="submit">수정</button>
      </form>
      <Link to="/home">홈으로</Link>
    </div>
          
    </body>
  );
};

export default EditPhoto;
