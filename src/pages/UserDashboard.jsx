import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user data
        const userRes = await fetch(`https://backend-es6y.onrender.com/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await userRes.json();
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        setUser(userData);

        // Fetch customer details (linked via user_id)
        const customerRes = await fetch(`https://backend-es6y.onrender.com/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const customerData = await customerRes.json();
        if (!customerRes.ok) throw new Error("Failed to fetch customer data");
        setCustomer(customerData);

        // Fetch appointments
        const appointmentsRes = await fetch(
          `https://backend-es6y.onrender.com/api/appointments/customer/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const appointmentsData = await appointmentsRes.json();
        if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");
        setAppointments(appointmentsData);

        // Fetch messages
        const messagesRes = await fetch(`https://backend-es6y.onrender.com/api/messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const messagesData = await messagesRes.json();
        if (!messagesRes.ok) throw new Error("Failed to fetch messages");
        setMessages(messagesData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!user || !customer) return <div className="text-center text-lg font-semibold mt-6">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-900 text-white p-6 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700">
              🏠 Home
            </Link>
          </li>
          <li>
            <button
              onClick={() => navigate(`/customer-dashboard/${id}/appointments`)}
              className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
            >
              📅 Appointments
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate(`/customer-dashboard/${id}/messages`)}
              className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
            >
              💬 Messages
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-4 rounded text-red-400 hover:bg-gray-700"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Welcome, {user.full_name}</h2>
        <p className="text-gray-600 text-center md:text-left">User Type: {user.userType}</p>
        <p className="text-gray-600 text-center md:text-left">📞 {customer.phone_number} | 📍 {customer.address}</p>

        {/* Appointments Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">📅 Your Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appt) => (
                <li key={appt.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="font-semibold">Specialist: {appt.specialist_name}</p>
                  <p>Service: {appt.service}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(appt.date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Messages Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">💬 Your Messages</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li key={msg.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="font-semibold">From: {msg.specialist_name}</p>
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
