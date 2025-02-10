import { Router } from 'express';
const router = Router();
import { getMessages, sendMessage } from '../controllers/chatController';

router.get('/:appointmentId', getMessages);
router.post('/', sendMessage);

export default router;