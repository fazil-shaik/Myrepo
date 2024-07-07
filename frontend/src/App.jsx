import  { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <div>
        <h1>Welcome to Web chat App</h1>
        <nav>
          {/* <Link to="/signup">Signup</Link> */}
          {/* <Link to="/login">Login</Link> */}
          {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/chat"
            element={token ? <Chat token={token} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
