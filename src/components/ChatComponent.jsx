import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = "https://backend-es6y.onrender.com/api";

const ChatComponent = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [lastMessageId, setLastMessageId] = useState(null);
  const chatContainerRef = useRef(null);
  const pollingRef = useRef(null);

  const clientId = Number(localStorage.getItem("userId"));

  // Fetch chats
  useEffect(() => {
    if (!clientId) return;

    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chats/${clientId}`);
        const data = await response.json();
        setChats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [clientId]);

  // Fetch messages
  const fetchMessages = async (chatId) => {
    if (!chatId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0 && data[data.length - 1].id !== lastMessageId) {
        setSelectedChat((prev) => (prev ? { ...prev, messages: data } : prev));
        setLastMessageId(data[data.length - 1].id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle chat selection
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.chat_id);

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => fetchMessages(chat.chat_id), 5000);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await fetch(`${API_BASE_URL}/chats/${selectedChat.chat_id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: clientId, message: newMessage }),
      });

      setNewMessage("");
      fetchMessages(selectedChat.chat_id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 🏷️ Function to format and group messages by date
  const formatMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toLocaleDateString();
      if (!groupedMessages[msgDate]) {
        groupedMessages[msgDate] = [];
      }
      groupedMessages[msgDate].push(msg);
    });
    return groupedMessages;
  };

  // 🏷️ Function to determine "Today" or "Yesterday"
  const getDateLabel = (dateStr) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return dateStr;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Chat List */}
      <div className="w-full md:w-1/3 bg-white shadow-lg overflow-y-auto">
        <h2 className="h-[70px] text-xl font-bold p-4 shadow">Chats</h2>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chat_id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 ${
                selectedChat?.chat_id === chat.chat_id ? "bg-gray-300" : ""
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex-1">
                <h3 className="font-semibold">{chat.specialist_name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {chat.last_message || "No messages yet"}
                </p>
                <p className="text-xs text-gray-600 flex justify-end">
                  {chat.last_message_time
                    ? new Date(chat.last_message_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">No chats available</p>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="h-[70px] p-4 flex items-center bg-white border-l border-gray-300">
              <h2 className="text-lg font-bold">{selectedChat.specialist_name}</h2>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-200">
              {selectedChat.messages && selectedChat.messages.length > 0 ? (
                Object.entries(formatMessagesByDate(selectedChat.messages)).map(([date, messages]) => (
                  <div key={date}>
                    <div className="flex justify-center my-2">
                      <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {getDateLabel(date)}
                      </span>
                    </div>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 p-2 rounded w-fit max-w-xs flex flex-col ${
                          msg.sender_id === clientId
                            ? "bg-blue-500 text-white ml-auto text-right"
                            : "bg-white text-black mr-auto text-left"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs text-gray-600 mt-1 self-end">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet</p>
              )}
            </div>

            <div className="p-4 bg-white flex">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
