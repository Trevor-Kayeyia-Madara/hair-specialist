import { supabase } from '../supabase.js';

class ChatMessage {
  constructor(id, sender_id, receiver_id, message) {
    this.id = id;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.message = message;
  }

  static async sendMessage(sender_id, receiver_id, message) {
    const { data, error } = await supabase.from('chat_messages').insert([{ sender_id, receiver_id, message }]);
    if (error) throw new Error(error.message);
    return data;
  }
}

export default ChatMessage;
