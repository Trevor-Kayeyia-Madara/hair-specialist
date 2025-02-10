import { Router } from 'express';
const router = Router();
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;