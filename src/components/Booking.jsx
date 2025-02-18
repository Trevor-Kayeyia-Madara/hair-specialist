import{ useState } from 'react';
import { supabase } from '../api/supabaseClient';

const Booking = () => {
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const handleBooking = async () => {
    const { error } = await supabase.from('appointments').insert([{ service_id: serviceId, date, time, status: 'booked' }]);
    if (error) console.error(error);
    else alert('Booking confirmed!');
  };
  
  return (
    <div>
      <h1>Book an Appointment</h1>
      <input type="date" onChange={(e) => setDate(e.target.value)} required />
      <input type="time" onChange={(e) => setTime(e.target.value)} required />
      <select onChange={(e) => setServiceId(e.target.value)} required>
        <option value="">Select Service</option>
        {/* Populate services from the database */}
      </select>
      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
};

export default Booking;
