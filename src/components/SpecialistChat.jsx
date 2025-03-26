import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = "https://backend-es6y.onrender.com/api";

const SpecialistChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const pollingRef = useRef(null);
  const chatListPollingRef = useRef(null); // Polling for chat list

  const specialistId = Number(localStorage.getItem("userId"));

  const fetchChats = async () => {
    if (!specialistId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${specialistId}`);
      const data = await response.json();
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    if (!specialistId) return;

    fetchChats();

    // Start polling for chat list updates
    chatListPollingRef.current = setInterval(fetchChats, 5000);

    return () => {
      if (chatListPollingRef.current) clearInterval(chatListPollingRef.current);
    };
  }, [specialistId]);

  const fetchMessages = async (chatId) => {
    if (!chatId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setSelectedChat((prev) => (prev ? { ...prev, messages: data } : prev));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.chat_id);

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => fetchMessages(chat.chat_id), 5000);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await fetch(`${API_BASE_URL}/chats/${selectedChat.chat_id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: specialistId, message: newMessage }),
      });

      setNewMessage("");
      fetchMessages(selectedChat.chat_id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatDateLabel = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List - Hidden when a chat is selected on mobile */}
      <div
        className={`w-full md:w-1/3 bg-white shadow-lg overflow-y-auto transition-transform transform ${
          selectedChat ? "translate-x-[-100%] md:translate-x-0" : "translate-x-0"
        } md:block fixed md:relative top-0 left-0 h-full`}
      >
        <h2 className="h-[70px] text-xl font-bold p-4 shadow bg-white">Chats</h2>
        {chats?.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chat_id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 ${
                selectedChat?.chat_id === chat.chat_id ? "bg-gray-300" : ""
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="flex-1">
                <h3 className="font-semibold">{chat.client_name}</h3>
                <p className="text-sm text-gray-600 truncate">{chat.last_message || "No messages yet"}</p>
                <p className="text-xs text-gray-600 flex justify-end">
                  {chat.last_message_time
                    ? new Date(chat.last_message_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">No chats available</p>
        )}
      </div>

      {/* Chat Window - Fullscreen on mobile */}
      <div className={`w-full md:w-2/3 flex flex-col ${selectedChat ? "block" : "hidden md:flex"}`}>
        {selectedChat ? (
          <>
            {/* Chat Header with Back Button for Mobile */}
            <div className="h-[70px] p-4 flex items-center bg-white border-b border-gray-300">
              <button className="md:hidden text-blue-500 mr-4" onClick={() => setSelectedChat(null)}>
                ← Back
              </button>
              <h2 className="text-lg font-bold">{selectedChat.client_name}</h2>
            </div>

            {/* Messages Container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-200">
              {Array.isArray(selectedChat.messages) && selectedChat.messages.length > 0 ? (
                selectedChat.messages.reduce((acc, msg, index) => {
                  const currentMessageDate = formatDateLabel(msg.timestamp);
                  const previousMessageDate =
                    index > 0 ? formatDateLabel(selectedChat.messages[index - 1].timestamp) : null;

                  if (currentMessageDate !== previousMessageDate) {
                    acc.push(
                      <div key={`date-${index}`} className="text-center my-3 text-gray-600 font-semibold">
                        {currentMessageDate}
                      </div>
                    );
                  }

                  acc.push(
                    <div
                      key={msg.id}
                      className={`mb-2 p-2 rounded w-fit max-w-xs flex flex-col ${
                        msg.sender_id === specialistId
                          ? "bg-blue-500 text-white ml-auto text-right"
                          : "bg-white text-black mr-auto text-left"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className="text-xs text-gray-600 mt-1 self-end">
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </p>
                    </div>
                  );

                  return acc;
                }, [])
              ) : (
                <p className="text-center text-gray-500">No messages yet</p>
              )}
            </div>

            {/* Message Input - Sticky at the bottom */}
            <div className="p-4 bg-white flex sticky bottom-0">
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

export default SpecialistChat;
