import React, { useState, useEffect } from "react";

const mockChats = [
  {
    id: 1,
    name: "John Doe",
    profilePic: "https://via.placeholder.com/40",
    lastMessage: "See you tomorrow!",
    lastMessageTime: "10:45 AM",
    messages: [
      { id: 1, sender: "client", message: "Hi, I need a consultation!" },
      { id: 2, sender: "specialist", message: "Sure! What would you like to discuss?" },
      { id: 3, sender: "client", message: "Any available slots tomorrow?" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    profilePic: "https://via.placeholder.com/40",
    lastMessage: "Thanks for your help!",
    lastMessageTime: "9:15 AM",
    messages: [
      { id: 1, sender: "client", message: "Can you suggest a treatment?" },
      { id: 2, sender: "specialist", message: "Yes! I recommend deep conditioning." },
      { id: 3, sender: "client", message: "Great! How much will it cost?" },
    ],
  },
];

const ChatComponent = () => {
  const [chats, setChats] = useState(mockChats);
  const [selectedChat, setSelectedChat] = useState(mockChats[0]); // Default to first chat
  const [newMessage, setNewMessage] = useState("");

  // Simulate polling every 2 seconds (new incoming messages)
  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { id: chat.messages.length + 1, sender: "client", message: "Just checking in!" },
                ],
                lastMessage: "Just checking in!",
                lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            : chat
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  // Function to send a message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, { id: chat.messages.length + 1, sender: "specialist", message: newMessage }],
              lastMessage: newMessage,
              lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : chat
      )
    );
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/3 bg-white border-r shadow-lg overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 ${
              selectedChat.id === chat.id ? "bg-gray-300" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <img src={chat.profilePic} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <h3 className="font-semibold">{chat.name}</h3>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
            <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
          </div>
        ))}
      </div>

      {/* Right Panel - Chat Window */}
      <div className="w-2/3 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center bg-white shadow-md">
          <img src={selectedChat.profilePic} alt={selectedChat.name} className="w-10 h-10 rounded-full mr-3" />
          <h2 className="text-lg font-bold">{selectedChat.name}</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
          {selectedChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded w-fit max-w-xs ${
                msg.sender === "specialist" ? "bg-blue-500 text-white ml-auto" : "bg-white"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
