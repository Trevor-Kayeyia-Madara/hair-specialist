import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  const { error } = await supabase.from('chat_messages').insert([{ sender_id, receiver_id, message }]);
  if (error) return res.status(400).json(error);
  res.status(201).json({ message: 'Message sent.' });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('chat_messages').select('*').or(`sender_id.eq.${id},receiver_id.eq.${id}`);
  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
