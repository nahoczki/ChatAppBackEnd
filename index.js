const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');

const http = require('http').Server(app);
const io = require('socket.io')(http);

dotenv.config();

io.on('connection', () =>{
    console.log('a user is connected')
})

//DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB")
);

//Routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const roomRoute = require('./routes/chatroom')

//Middleware
app.use(express.json());


//Route Middleware
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/rooms', roomRoute);


app.listen(process.env.PORT, '::1', () => console.log("Server listening on port " + process.env.PORT))