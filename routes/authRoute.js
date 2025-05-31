import express from 'express';
import Auth from '../controllers/authController.js';
export const authRouter = express.Router();

//Auth Routes
authRouter.post('/signup', Auth.signup);
authRouter.post('/signin', Auth.login);
