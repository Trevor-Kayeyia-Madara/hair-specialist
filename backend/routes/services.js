import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, description, duration, price, specialist_id } = req.body;
  const { error } = await supabase.from('services').insert([{ name, description, duration, price, specialist_id }]);
  if (error) return res.status(400).json(error);
  res.status(201).json({ message: 'Service created.' });
});

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('services').select('*');
  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
