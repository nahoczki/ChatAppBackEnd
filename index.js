const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');

//const http = require('http').Server(app);


dotenv.config();



//DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB")
);

//Routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const roomRoute = require('./routes/chatroom');

//Middleware
app.use(express.json());


//Route Middleware
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/rooms', roomRoute);


const server = app.listen(process.env.PORT, () => console.log("Server listening on port " + process.env.PORT));
const {socketHandler} = require('./helpers/socket-handler');

socketHandler(server);