import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line no-undef
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function getAllUsers(req, res) {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
}

export async function getUserById(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase.from('users').select('*').eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data[0]);
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { email, role } = req.body;
    const { data, error } = await supabase
        .from('users')
        .update({ email, role })
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data[0]);
}

export async function deleteUser(req, res) {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
}