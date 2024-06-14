import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import Home from './components/Home';
import Home1 from './components/Home1';
import Login from './components/Login';
import Register from './components/Register';
import Messages from './components/Messages';
import SendMessage from './components/SendMessage';
import ReplyMessage from './components/ReplyMessage';
import EditPhoto from './components/EditPhoto';
import Search from './components/Search';
import Search1 from './components/Search1';

const App = () => {
  const { setUser } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home1" element={<Home1 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={setUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/messages" element={setUser ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/messages/:receiverId" element={<SendMessage />} />
        <Route path="/reply/:messageId" element={setUser ? <ReplyMessage /> : <Navigate to="/login" />} />
        <Route path="/edit/:photoId" element={setUser ? <EditPhoto /> : <Navigate to="/login" />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search1" element={<Search1 />} />
      </Routes>
    </Router>
  );
};

export default App;
