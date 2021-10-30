import express from 'express';
import { registerController, loginController, refreshTokenController, forgetPassword, resetPassword } from '../controllers/auth.js';

const Router = express.Router();

Router.post('/register', registerController);
Router.post('/login', loginController);
Router.get('/refreshToken', refreshTokenController);
Router.post('/forgetPassword', forgetPassword);
Router.post('/resetPassword', resetPassword);

export default Router;