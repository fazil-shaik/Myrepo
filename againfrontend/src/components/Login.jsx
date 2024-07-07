import  { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post('https://myrepo-1.onrender.com/login', {
        username,
        password,
      });
      setToken(response.data.token);
      navigate('/chat');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('Login failed: Network or server error');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      {error && <div>{error}</div>}
      <p>
        Dont have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
