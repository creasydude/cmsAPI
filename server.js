import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from './configs/connectDB.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoute from './routes/auth.js';
import postRoute from './routes/post.js';
import userPostRoute from './routes/userPost.js';

// DEPS
const app = express();
dotenv.config({path : "./config.env"});
connectDB();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// Middlewares

//Routes
app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/user/post', userPostRoute);

//Error Handle Route
app.use(errorHandler);

//Handle Not Found Path
app.use((_,res) => {
    res.status(404).json({
        message : "Not Found."
    })
})

//Listen
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT)
process.on('unhandledRejection', (err) => {
    console.log(err);
    server.close(process.exit(1));
})