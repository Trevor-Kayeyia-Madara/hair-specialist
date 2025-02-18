import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, name, location, userType } = req.body;
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json(error);
  await supabase.from('users').insert([{ id: user.id, name, location, userType }]);
  res.status(201).json({ user });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
