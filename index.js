const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

//const http = require('http').Server(app);


dotenv.config();

const corsOptions = {
    exposedHeaders: 'Auth-Token',
};



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
app.use(cors(corsOptions))
app.use(express.json());
app.use(morgan('tiny'))


//Route Middleware
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/rooms', roomRoute);


const server = app.listen(process.env.PORT, () => console.log("Server listening on port " + process.env.PORT));
const {socketHandler} = require('./helpers/socket-handler');

socketHandler(server);