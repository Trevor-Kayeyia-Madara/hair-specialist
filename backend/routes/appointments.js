import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { service_id, date, time, customer_id, specialist_id } = req.body;
  const { error } = await supabase.from('appointments').insert([{ service_id, date, time, customer_id, specialist_id }]);
  if (error) return res.status(400).json(error);
  res.status(201).json({ message: 'Appointment created.' });
});

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('appointments').select('*');
  if (error) return res.status(400).json(error);
  res.json(data);
});

export default router;
