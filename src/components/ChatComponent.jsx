import React, { useState, useEffect, useRef } from "react";

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
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const chatContainerRef = useRef(null);

  // Simulate polling for new messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Function to fetch new messages
  const fetchNewMessages = () => {
    setChats((prevChats) =>
      prevChats.map((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: chat.messages.length + 1,
            sender: "client",
            message: `New message at ${new Date().toLocaleTimeString()}`,
          },
        ],
        lastMessage: `New message at ${new Date().toLocaleTimeString()}`,
        lastMessageTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }))
    );
  };

  // Automatically update selectedChat when chats change
  useEffect(() => {
    setSelectedChat((prevChat) => chats.find((chat) => chat.id === prevChat.id) || chats[0]);
  }, [chats]);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat.messages]);

  // Function to send a message
  const sendMessage = (newMessage) => {
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
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/3 bg-white shadow-lg overflow-y-auto">
        <h2 className="h-[70px] text-xl font-bold p-4 shadow">Chats</h2>
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
        <div className="h-[70px] p-4 flex items-center bg-white border-l border-gray-300">
          <img src={selectedChat.profilePic} alt={selectedChat.name} className="w-10 h-10 rounded-full mr-3" />
          <h2 className="text-lg font-bold">{selectedChat.name}</h2>
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-200">
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
        <div className="p-4 bg-white flex">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded"
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(e.target.value);
            }}
          />
          <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={() => sendMessage(newMessage)}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
