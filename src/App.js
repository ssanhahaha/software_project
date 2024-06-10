// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { UserProvider } from './UserContext';
// import Home from './components/Home';
// import Login from './components/Login';
// import Register from './components/Register';
// import Messages from './components/Messages';
// import Message from './components/Message';
// import Reply from './components/Reply';
// import Edit from './components/Edit';
// import Search from './components/Search';

// const App = () => {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} />  // /home 경로 설정
//           <Route path="/Login" element={<Login />} />
//           <Route path="/Register" element={<Register />} />
//           <Route path="/Messages" element={<Messages />} />
//           <Route path="/Message/:receiverId" element={<Message />} />
//           <Route path="/Reply/:messageId" element={<Reply />} />
//           <Route path="/Edit/:photoId" element={<Edit />} />
//           <Route path="/Search" element={<Search />} />
//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// };

// export default App;
// import React, { useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { UserContext } from './UserContext'; // UserProvider 제거
// import Home from './components/Home';
// import Login from './components/Login';
// import Register from './components/Register';
// import Messages from './components/Messages';
// import SendMessage from './components/SendMessage';
// import ReplyMessage from './components/ReplyMessage';
// import EditPhoto from './components/EditPhoto';
// import Search from './components/Search';

// const App = () => {
//   const { setUser } = useContext(UserContext);
//   // setUser
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={setUser ? <Home /> : <Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/home" element={setUser ? <Home /> : <Navigate to="/login" />} />
//         <Route path="/messages" element={setUser ? <Messages /> : <Navigate to="/login" />} />
//         <Route path="/message/:receiverId" element={setUser ? <SendMessage /> : <Navigate to="/login" />} />
//         <Route path="/reply/:messageId" element={setUser ? <ReplyMessage /> : <Navigate to="/login" />} />
//         <Route path="/edit/:photoId" element={setUser ? <EditPhoto /> : <Navigate to="/login" />} />
//         <Route path="/search" element={setUser ? <Search /> : <Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// import React, { useContext } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { UserContext } from './UserContext';
// import Home from './components/Home';
// import Home1 from './components/Home1';
// import Login from './components/Login';
// import Register from './components/Register';
// import Messages from './components/Messages';
// import SendMessage from './components/SendMessage';
// import ReplyMessage from './components/ReplyMessage';
// import EditPhoto from './components/EditPhoto';
// import Search from './components/Search';

// const App = () => {
//   const { user } = useContext(UserContext);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/home1" element={<Home1 />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
//         <Route path="/message/:receiverId" element={user ? <SendMessage /> : <Navigate to="/login" />} />
//         <Route path="/reply/:messageId" element={user ? <ReplyMessage /> : <Navigate to="/login" />} />
//         <Route path="/edit/:photoId" element={user ? <EditPhoto /> : <Navigate to="/login" />} />
//         <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
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
      </Routes>
    </Router>
  );
};

export default App;
