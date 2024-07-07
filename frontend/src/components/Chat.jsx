import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Chat.css';

const Chat = ({ token }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
      setWs(socket);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.text) {
        setChat((prev) => [...prev, data.text]);
      }
    };
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({ token, text: message }));
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

Chat.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Chat;
