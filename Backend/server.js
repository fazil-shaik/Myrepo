const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Chat = require('./models/Chat');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const app = express();

app.use(cors())

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const JWT_SECRET = 'secret123@';

const MONGODBURI = process.env.MONGODB;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODBURI, {})
// User signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.send({ message: 'User created' });
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.send({ token });
});

// WebSocket connection
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const { token, text } = JSON.parse(message);
    try {
      const { userId } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(userId);
      if (!user) throw new Error('Invalid user');
      const chat = new Chat({ user: userId, text });
      await chat.save();
      ws.send(JSON.stringify({ text }));
    } catch (error) {
      ws.send(JSON.stringify({ error: 'Authentication failed' }));
    }
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
