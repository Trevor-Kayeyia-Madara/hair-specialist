import { supabase } from '../supabase.js';

class Appointment {
  constructor(id, service_id, customer_id, date, time, status) {
    this.id = id;
    this.service_id = service_id;
    this.customer_id = customer_id;
    this.date = date;
    this.time = time;
    this.status = status;
  }

  static async createAppointment(service_id, customer_id, date, time) {
    const { data, error } = await supabase.from('appointments').insert([{ service_id, customer_id, date, time, status: 'booked' }]);
    if (error) throw new Error(error.message);
    return data;
  }
}

export default Appointment;
