import React, { useState, useEffect } from 'react';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat'); // Replace with your API endpoint
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Polling every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        // Fetch updated messages immediately after sending
        const updatedMessages = await response.json();
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-80">
      <div className="h-64 overflow-y-auto border-b mb-2 p-2">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-200 rounded">
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
