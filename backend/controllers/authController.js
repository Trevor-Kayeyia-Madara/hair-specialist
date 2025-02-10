import { createClient } from '@supabase/supabase-js';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// eslint-disable-next-line no-undef
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function signUp(req, res) {
    const { email, password, userType, name, location } = req.body;

    const hashedPassword = await hash(password, 10);
    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, userType, name, location }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'User created', user: data[0] });
}

export async function login(req, res) {
    const { email, password } = req.body;
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error || users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    // eslint-disable-next-line no-undef
    const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
}