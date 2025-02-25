import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

// Backend API URL
const SOCKET_SERVER_URL = "https://backend-es6y.onrender.com";

const ChatWindow = ({ currentUser }) => {
  const { specialistId } = useParams(); // Get specialist ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [specialist, setSpecialist] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Connect to Socket.IO and fetch chat history
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join chat room
    newSocket.emit("joinRoom", { customerId: currentUser.id, specialistId });

    // Listen for new messages
    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    // Fetch chat history
    fetch(`${SOCKET_SERVER_URL}/api/chat/${currentUser.id}/${specialistId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      })
      .catch((error) => console.error("Error fetching messages:", error));

    return () => newSocket.disconnect();
  }, [currentUser.id, specialistId]);

  // Fetch specialist details
  useEffect(() => {
    fetch(`${SOCKET_SERVER_URL}/api/specialists/${specialistId}`)
      .then((res) => res.json())
      .then((data) => setSpecialist(data))
      .catch((error) => console.error("Error fetching specialist details:", error));
  }, [specialistId]);

  // Send message
  const handleSend = () => {
    if (newMessage.trim() && socket) {
      socket.emit("sendMessage", {
        senderId: currentUser.id,
        receiverId: specialistId,
        message: newMessage,
      });

      setMessages((prev) => [
        ...prev,
        { senderId: currentUser.id, receiverId: specialistId, content: newMessage },
      ]);
      setNewMessage("");
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-white rounded-lg shadow-xl">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b">
        {specialist && (
          <div>
            <h3 className="font-semibold">{specialist?.full_name || "Loading..."}</h3>
            <p className="text-xs text-gray-500">{specialist?.isOnline ? "Online" : "Offline"}</p>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-[280px] ${message.senderId === currentUser.id ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 hover:bg-blue-700"
          disabled={!newMessage.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

// PropTypes Validation
ChatWindow.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatWindow;
