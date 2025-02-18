import express from 'express';

import {userRegistration,userLogin,adminLogin,googleLogin} from '../controller/userController.js';


const userRouter = express.Router();

userRouter.post('/register', userRegistration);
userRouter.post('/login', userLogin);
userRouter.post('/admin-login', adminLogin);
userRouter.post('/google-login', googleLogin);

export default userRouter;


