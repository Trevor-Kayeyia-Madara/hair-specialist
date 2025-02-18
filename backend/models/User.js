import { supabase } from '../supabase.js';

class User {
  constructor(id, email, name, location, userType) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.location = location;
    this.userType = userType;
  }

  static async createUser(email, password, name, location, userType) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    await supabase.from('users').insert([{ id: user.id, name, location, userType }]);
    return new User(user.id, email, name, location, userType);
  }
}

export default User;
