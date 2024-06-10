
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SendMessage.css';
const SendMessage = () => {
  const { receiverId } = useParams();
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!receiverId) {
      console.error('Receiver ID is not defined');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ receiverId, content }),
      });

      if (response.ok) {
        alert('메시지를 보냈습니다.');
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('Failed to send message:', errorData);
        alert('메시지 전송에 실패했습니다: ' + errorData.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('메시지 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <body className="send">

    <div className="send-message-container">
      <h1>메시지 보내기</h1>
      <form onSubmit={handleSendMessage}>
        <label htmlFor="content">메시지 내용:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="send-button">보내기</button>
      </form>
    </div>
          
    </body>
  );
};

export default SendMessage;
