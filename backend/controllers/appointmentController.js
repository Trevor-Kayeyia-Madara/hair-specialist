/* eslint-disable no-undef */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Function to check if a time slot is available
const isTimeSlotAvailable = async (specialistId, startTime, endTime) => {
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('specialist_id', specialistId)
        .or(`(start_time.lte.${endTime}, end_time.gte.${startTime})`);

    if (error) throw new Error(error.message);
    return appointments.length === 0; // No conflicting appointments
};

// Function to check if the requested time is within business hours
const isWithinBusinessHours = async (specialistId, startTime) => {
    const dayOfWeek = new Date(startTime).getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    const { data: hours, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('specialist_id', specialistId)
        .eq('day_of_week', dayOfWeek);

    if (error) throw new Error(error.message);
    if (hours.length === 0) return false; // No business hours available for this day

    const requestedTime = new Date(startTime).getHours();
    return hours.some(hour => {
        const openTime = new Date(`1970-01-01T${hour.open_time}`).getHours();
        const closeTime = new Date(`1970-01-01T${hour.close_time}`).getHours();
        return requestedTime >= openTime && requestedTime < closeTime;
    });
};

// Function to create an appointment
exports.createAppointment = async (req, res) => {
    const { specialist_id, customer_id, start_time, end_time } = req.body;

    try {
        // Check if the requested time is within business hours
        const isAvailable = await isWithinBusinessHours(specialist_id, start_time);
        if (!isAvailable) {
            return res.status(400).json({ error: 'Requested time is outside of business hours.' });
        }

        // Check if the time slot is available
        const isSlotAvailable = await isTimeSlotAvailable(specialist_id, start_time, end_time);
        if (!isSlotAvailable) {
            return res.status(400).json({ error: 'Time slot is already booked.' });
        }

        // Create the appointment
        const { data, error } = await supabase
            .from('appointments')
            .insert([{ specialist_id, customer_id, start_time, end_time, status: 'confirmed' }]);

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to get all appointments for a specialist
exports.getAppointmentsBySpecialist = async (req, res) => {
    const { specialist_id } = req.params;
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('specialist_id', specialist_id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
};