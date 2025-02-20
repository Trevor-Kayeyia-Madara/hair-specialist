import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import ChatWindow from "../components/ChatWindow";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Simulate fetching user session data
    setTimeout(() => {
      const sessionData = JSON.parse(localStorage.getItem("userSession"));

      if (sessionData) {
        setCurrentUser(sessionData);
        setSessionActive(true);
      } else {
        setSessionActive(false);
      }
      setLoading(false);
    }, 1000);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userSession"); // Remove session from storage
    setCurrentUser(null);
    setSessionActive(false);
    navigate("/login"); // Redirect to login page
  };

  const upcomingAppointments = [
    {
      id: 1,
      date: "2025-02-15T10:00:00",
      specialist: { name: "Sarah Johnson", avatar: "/specialist1.jpg" },
      service: "Balayage",
    },
    {
      id: 2,
      date: "2025-02-20T14:30:00",
      specialist: { name: "Mike Wilson", avatar: "/specialist2.jpg" },
      service: "Haircut & Style",
    },
  ];

  const tabContent = {
    upcoming: (
      <div className="grid gap-4">
        {upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={appointment.specialist.avatar}
                  alt={appointment.specialist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{appointment.service}</h3>
                  <p className="text-gray-600">with {appointment.specialist.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                  Reschedule
                </button>
                <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    messages: sessionActive ? (
      <div className="flex gap-4">
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Your Specialists</h3>
        </div>
        <div className="w-2/3">
          <ChatWindow messages={[]} onSendMessage={() => {}} currentUser={currentUser} />
        </div>
      </div>
    ) : (
      <p className="text-gray-500">No active session. Start a new chat.</p>
    ),
  };

  return (
    <div className="p-6">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Dashboard</h2>
            {sessionActive && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200"
              } rounded-lg`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Appointments
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "messages" ? "bg-blue-600 text-white" : "bg-gray-200"
              } rounded-lg`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </button>
          </div>
          <div className="mt-4">{tabContent[activeTab]}</div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
