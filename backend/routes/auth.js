import { Router } from 'express';
const router = Router();
import { signUp, login } from '../controllers/authController';

router.post('/signup', signUp);
router.post('/login', login);

export default router;