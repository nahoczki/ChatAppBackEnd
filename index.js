const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config();


//DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB")
);

//Routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');

//Middleware
app.use(express.json());


//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/users', usersRoute);


app.listen(process.env.PORT, () => console.log("Server listening on port " + process.env.PORT))
