import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user details
        const response = await fetch(`https://backend-es6y.onrender.com/api/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to fetch user data");
        setUser(result);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(`https://backend-es6y.onrender.com/api/appointments/customer/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (!response.ok) throw new Error("Failed to fetch appointments");
        setAppointments(result);
      } catch (err) {
        console.error("Appointments Error:", err.message);
      }
    };

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(`https://backend-es6y.onrender.com/api/messages/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (!response.ok) throw new Error("Failed to fetch messages");
        setMessages(result);
      } catch (err) {
        console.error("Messages Error:", err.message);
      }
    };

    fetchUserProfile();
    fetchAppointments();
    fetchMessages();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div className="text-center">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="hover:underline">🏠 Home</Link>
          </li>
          <li>
            <button onClick={() => navigate(`/customer-dashboard/${id}/appointments`)} className="hover:underline">
              📅 Appointments
            </button>
          </li>
          <li>
            <button onClick={() => navigate(`/customer-dashboard/${id}/messages`)} className="hover:underline">
              💬 Messages
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className="text-red-400 hover:underline">🚪 Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.full_name}</h2>
        <p className="text-gray-600">User Type: {user.userType}</p>

        {/* Appointments Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">📅 Your Appointments</h3>
          {appointments.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((appt) => (
                <li key={appt.id} className="bg-white p-4 rounded shadow">
                  <p><strong>Specialist:</strong> {appt.specialist_name}</p>
                  <p><strong>Service:</strong> {appt.service}</p>
                  <p><strong>Date:</strong> {new Date(appt.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Messages Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">💬 Your Messages</h3>
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li key={msg.id} className="bg-white p-4 rounded shadow">
                  <p><strong>From:</strong> {msg.specialist_name}</p>
                  <p>{msg.content}</p>
                  <p className="text-sm text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
