import React, { useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReplyMessage.css';

const ReplyMessage = () => {
  const { messageId } = useParams();
  // const [message, setMessage] = useState(null);
  const [reply, setReply] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchMessage = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         credentials: 'include',
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setMessage(data);
  //       } else {
  //         console.error('Failed to fetch message:', await response.json());
  //       }
  //     } catch (error) {
  //       console.error('Error fetching message:', error);
  //     }
  //   };

  //   fetchMessage();
  // }, [messageId]);

  const handleReply = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/messages/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ messageId, content: reply }),
    });
    if (response.ok) {
      alert('답장을 보냈습니다.');
      navigate('/home');
    } else {
      console.error('Failed to send reply');
    }
  };

  return (
    <body className="replys">
      <div className="container">
        <h1>답장</h1>
        <form onSubmit={handleReply}>
          <label htmlFor="reply">메시지:</label>
          <div>
          <textarea 
            id="reply" 
            value={reply} 
            onChange={(e) => setReply(e.target.value)} 
            required 
          />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn-reply">전송</button>
            <button type="button" className="btn-delete" onClick={() => navigate('/home')}>취소</button>
          </div>
        </form>
      </div>
    </body>
  );
};

export default ReplyMessage;

// import React, { useState} from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './ReplyMessage.css';
// const ReplyMessage = () => {
//   const { messageId } = useParams();
//   // const [message] = useState(null);
//   const [reply, setReply] = useState('');
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const fetchMessage = async () => {
//   //     const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
//   //       method: 'GET',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       credentials: 'include',
//   //     });
//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       setMessage(data);
//   //     } else {
//   //       console.error('Failed to fetch message');
//   //     }
//   //   };

//   //   fetchMessage();
//   // }, [messageId]);

//   const handleReply = async (e) => {
//     e.preventDefault();
//     const response = await fetch('http://localhost:5000/api/messages/reply', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//       body: JSON.stringify({ messageId, content: reply }),
//     });
//     if (response.ok) {
//       alert('답장을 보냈습니다.');
//       navigate('/home');
//     } else {
//       console.error('Failed to send reply');
//     }
//   };

//   return (
//     <body className='reply'>
//     <div className='container'>
//       <h1>답장</h1>
//       <form onSubmit={handleReply}>
//           <label htmlFor="reply">메시지:</label>
//           <textarea 
//             id="reply" 
//             value={reply} 
//             onChange={(e) => setReply(e.target.value)} 
//             required 
//           />
//           <div className="btn-group">
//             <button type="submit" className="btn-reply">전송</button>
//             <button type="button" className="btn-delete" onClick={() => navigate('/home')}>취소</button>
//           </div>
//         </form>
//       {/* <form onSubmit={handleReply}>
//         <label htmlFor="reply">답장 내용:</label>
//         <textarea id="reply" value={reply} onChange={(e) => setReply(e.target.value)} required />
//         <div>
//         <button type="submit" className="btn-reply">보내기</button>
//         </div>
//         <div>
//         <button type="button" className="btn-delete" onClick={() => navigate('/home')}>취소</button>
//         </div>
//       </form> */}
//     </div>
//     </body>
//   );
// };

// export default ReplyMessage;
