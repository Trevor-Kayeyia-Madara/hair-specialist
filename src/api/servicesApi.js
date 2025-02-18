import { supabase } from './supabaseClient';

export const fetchUsers = async () => {
  const { data } = await supabase.from('users').select('*');
  return data;
};

export const fetchServices = async () => {
  const { data } = await supabase.from('services').select('*');
  return data;
};

export const fetchAppointments = async () => {
  const { data } = await supabase.from('appointments').select('*');
  return data;
};

export const fetchReviews = async () => {
  const { data } = await supabase.from('reviews').select('*');
  return data;
};

export const fetchChatMessages = async () => {
  const { data } = await supabase.from('chat_messages').select('*');
  return data;
};
