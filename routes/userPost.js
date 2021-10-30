import express from 'express';
import { showPostController, updatePostController, deletePostController } from '../controllers/userPost.js';
import userAuthControl from '../middlewares/userAuthControl.js';
const Router = express.Router();

Router.get('/show', userAuthControl, showPostController);
Router.put('/update', userAuthControl, updatePostController);
Router.delete('/delete', userAuthControl, deletePostController);

export default Router;