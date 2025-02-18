import { supabase } from '../supabase.js';

class Service {
  constructor(id, name, description, duration, price) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.price = price;
  }

  static async createService(name, description, duration, price, specialist_id) {
    const { data, error } = await supabase.from('services').insert([{ name, description, duration, price, specialist_id }]);
    if (error) throw new Error(error.message);
    return data;
  }
}

export default Service;
