import express from 'express';
import * as userController from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/users', auth, userController.getAllUsers);

export default router;
