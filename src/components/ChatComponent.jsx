import React, { useState, useEffect } from "react";

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "client", message: "Hi, I need a consultation!" },
    { id: 2, sender: "specialist", message: "Sure! What would you like to discuss?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Simulate polling every 2 seconds (new incoming messages)
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: "client", message: "Any available slots tomorrow?" },
      ]);
    }, 5000); // Simulated new messages every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to send messages
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, sender: "specialist", message: newMessage },
    ]);
    setNewMessage("");
  };

  return (
    <div className="p-4 border rounded-lg w-80 bg-white shadow-lg">
      <div className="h-64 overflow-y-auto border-b mb-2 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.sender === "specialist" ? "bg-blue-500 text-white self-end" : "bg-gray-200"
            }`}
          >
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
