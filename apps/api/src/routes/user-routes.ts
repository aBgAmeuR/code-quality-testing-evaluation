import express from 'express';
import {
  getAllUsers,
  loginUser,
  registerUser
} from '../controllers/user-controller';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/users', auth, getAllUsers);

export default router;
