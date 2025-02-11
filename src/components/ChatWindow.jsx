import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ChatWindow = ({
  messages = [],
  onSendMessage,
  currentUser,
  otherUser,
  isTyping = false,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage({ type: 'text', content: newMessage });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-white rounded-lg shadow-xl font-montserrat">
      <div className="flex items-center p-4 border-b">
        <div className="relative">
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
          ></div>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold">{otherUser.name}</h3>
          <p className="text-xs text-gray-500">
            {otherUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            {message.senderId !== currentUser.id && (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
            )}
            <div>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[280px] ${
                  message.senderId === currentUser.id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center">
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 rounded-full border focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes Validation
ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      senderId: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  otherUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    isOnline: PropTypes.bool,
  }).isRequired,
  isTyping: PropTypes.bool.isRequired,
};

export default ChatWindow;
