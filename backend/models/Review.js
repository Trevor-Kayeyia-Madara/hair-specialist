import { supabase } from '../supabase.js';

class Review {
  constructor(id, rating, comment, customer_id, specialist_id) {
    this.id = id;
    this.rating = rating;
    this.comment = comment;
    this.customer_id = customer_id;
    this.specialist_id = specialist_id;
  }

  static async createReview(rating, comment, customer_id, specialist_id) {
    const { data, error } = await supabase.from('reviews').insert([{ rating, comment, customer_id, specialist_id }]);
    if (error) throw new Error(error.message);
    return data;
  }
}

export default Review;
