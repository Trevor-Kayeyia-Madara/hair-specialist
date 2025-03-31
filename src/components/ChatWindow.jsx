import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

// Backend API URL
const SOCKET_SERVER_URL = "https://backend-es6y.onrender.com";

const ChatWindow = ({ currentUser }) => {
  const { specialistId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [specialist, setSpecialist] = useState(null);
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch Specialist Details
  useEffect(() => {
    fetch(`${SOCKET_SERVER_URL}/api/specialists/${specialistId}`)
      .then((res) => res.json())
      .then((data) => setSpecialist(data))
      .catch((error) => console.error("Error fetching specialist details:", error));
  }, [specialistId]);

  // Connect to Socket.IO & Fetch Messages
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join chat room
    newSocket.emit("joinRoom", { customerId: currentUser.id, specialistId });

    // Listen for new messages
    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Fetch chat history
    fetch(`${SOCKET_SERVER_URL}/api/chat/${currentUser.id}/${specialistId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      })
      .catch((error) => console.error("Error fetching messages:", error));

    return () => newSocket.disconnect();
  }, [currentUser, specialistId]);

  // Send Message Function
  const handleSend = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: specialistId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", messageData);

    setMessages((prev) => [...prev, messageData]); // Optimistic UI update
    setNewMessage("");
    scrollToBottom();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-gray-100 shadow-lg rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-blue-600 text-white rounded-t-lg shadow">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{specialist ? specialist.full_name : "Loading..."}</h3>
          <p className="text-xs text-gray-200">Specialist</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                message.senderId === currentUser.id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className="text-xs text-right mt-1 opacity-70">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex items-center bg-white rounded-b-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 ml-2 rounded-full hover:bg-blue-700"
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
