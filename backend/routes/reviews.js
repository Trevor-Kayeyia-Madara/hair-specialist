import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { comment, rating, customer_id, specialist_id } = req.body;
  const { error } = await supabase.from('reviews').insert([{ comment, rating, customer_id, specialist_id }]);
  if (error) return res.status(400).json(error);
  res.status(201).json({ message: 'Review submitted.' });
});

router.get('/:specialist_id', async (req, res) => {
  const { specialist_id } = req.params;
  const { data, error } = await supabase.from('reviews').select('*').eq('specialist_id', specialist_id);
  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
