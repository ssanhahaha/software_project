import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMessages(messages.filter(message => message.id !== messageId));
        alert('메시지를 삭제했습니다.');
      } else {
        console.error('Failed to delete message:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  const handleReply = (sender) => {
    window.location.href = `/reply/${sender}`;
  };

  return (
    <body className="messages">
      <div className="container">
      <h1>받은 메시지</h1>
      <Link to="/home">홈으로</Link>
      <ul>
        <div>
        {messages.map(message => (
          <li key={message.id}>
            <p>보낸 사람: {message.sender}</p>
            <p>메시지: {message.content}</p>
            <p>시간: {message.timestamp}</p>
            <div className="btn-group">
            <button onClick={() => handleReply(message.sender)} className="btn-reply">답장</button>
                <Link to="#" onClick={() => handleDelete(message.id)} className="btn-delete">삭제</Link>
            </div>
          </li>
        ))}
        </div>
      </ul>
      </div>
    </body>
  );
};

export default Messages;

