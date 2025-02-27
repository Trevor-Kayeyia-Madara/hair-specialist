import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ChatPage = () => {
  const { customerId } = useParams(); // Get customer ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://backend-es6y.onrender.com/api/chat/${customerId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    fetchMessages();
  }, [customerId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`https://backend-es6y.onrender.com/api/chat/send`, {
        senderId: localStorage.getItem("userId"), // Assuming stored userId
        receiverId: customerId,
        content: newMessage,
      });

      setMessages([...messages, { senderId: "You", content: newMessage }]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Chat with Client</h2>
      <div className="h-80 overflow-y-auto border p-4 rounded-lg bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-3">
              <span className="font-semibold">{msg.senderId === "You" ? "You" : "Client"}:</span>
              <p className="bg-blue-100 p-2 rounded-lg mt-1">{msg.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
