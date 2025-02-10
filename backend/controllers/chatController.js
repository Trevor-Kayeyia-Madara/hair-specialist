/* eslint-disable no-undef */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.getMessages = async (req, res) => {
    const { appointmentId } = req.params;
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('appointment_id', appointmentId);
    
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};

exports.sendMessage = async (req, res) => {
    const { appointmentId, sender, content } = req.body;
    const { data, error } = await supabase
        .from('messages')
        .insert([{ appointment_id: appointmentId, sender, content }]);
    
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
};