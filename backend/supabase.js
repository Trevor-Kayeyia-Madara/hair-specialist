import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import process from 'process';
// Load environment variables
dotenv.config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
