// server.js

// 1. Required Modules
const express = require('express');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. App Initialization
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins (change for production)
  },
});

// 3. Middlewares
app.use(express.json());
app.use(cors());

// 4. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.error('MongoDB Connection Error:', err));

// 5. Socket.io Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Receive message from client
  socket.on('chatMessage', (msg) => {
    console.log('Message:', msg);

    // Send message to all clients
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 6. Basic Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// 7. Start Server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
