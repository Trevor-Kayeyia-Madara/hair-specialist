import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

// Backend API URL
const SOCKET_SERVER_URL = "https://backend-es6y.onrender.com";

const SpecialistDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Specialist ID from URL
  const navigate = useNavigate(); // Hook for navigation
  const [messages, setMessages] = useState([]);
  
  // ✅ Store socket in state
  const [socket, setSocket] = useState(null);

  // Fetch Specialist Profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SOCKET_SERVER_URL}/api/specialists/${id}`);
      setProfile(response.data);
      setError(null);
    } catch {
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (selectedTab === "profile") {
      fetchProfile();
    }
  }, [selectedTab, fetchProfile]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${SOCKET_SERVER_URL}/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [id]);

  useEffect(() => {
    if (selectedTab === "messages") {
      fetchMessages();
    }
  }, [selectedTab, fetchMessages]);

  // ✅ Connect to Socket.IO and listen for real-time updates
  useEffect(() => {
    if (!id) return;

    const newSocket = io(SOCKET_SERVER_URL); // ✅ Create socket connection
    setSocket(newSocket); // ✅ Store socket instance in state

    // ✅ Listen for new messages and update UI
    newSocket.on("receiveMessage", (message) => {
      if (message.receiverId === id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // ✅ Ensure socket is used inside `useEffect`
    newSocket.emit("joinRoom", { specialistId: id });

    return () => {
      newSocket.disconnect(); // ✅ Proper cleanup on unmount
    };
  }, [id]);

  const handleLogout = () => {
    navigate("/login"); // Redirect to login on logout
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between h-screen">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul>
            {["profile", "appointments", "messages"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setSelectedTab(tab)}
                  className={`block w-full text-left p-3 rounded-lg font-semibold ${
                    selectedTab === tab ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {selectedTab === "profile" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Specialist Profile</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : profile ? (
              <div className="flex flex-col items-center">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-700 text-lg">👤</span>
                </div>
                <h3 className="text-lg font-semibold">{profile.full_name}</h3>
                <p className="text-gray-600">{profile.email}</p>
                <div className="mt-4 w-full border-t pt-4 text-sm text-gray-700">
                  <p><strong>Speciality:</strong> {profile.speciality}</p>
                  <p><strong>Service Rates:</strong> {profile.service_rates}</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p><strong>Joined:</strong> {new Date(profile.user_created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-center">No user data available.</p>
            )}
          </div>
        )}

        {selectedTab === "appointments" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Appointments</h2>
            <p className="text-center">No upcoming appointments.</p>
          </div>
        )}

        {selectedTab === "messages" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Messages</h2>
            {messages.length === 0 ? (
              <p className="text-center">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {messages.map((msg, index) => (
                  <li key={index} className="p-3 hover:bg-gray-100 flex justify-between items-center">
                    <span className="text-sm">
                      <strong>{msg.senderName}</strong>: {msg.message.length > 20 ? msg.message.slice(0, 20) + "..." : msg.message}
                    </span>
                    <Link
                      to={`/chat/${msg.senderId}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600"
                    >
                      Open Chat
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SpecialistDashboard;
