import express from 'express';
import { createPostController, showPostsController } from '../controllers/post.js';
import userAuthControl from '../middlewares/userAuthControl.js';
const Router = express.Router();

Router.post('/create', userAuthControl, createPostController);
Router.get('/show', showPostsController);

export default Router;