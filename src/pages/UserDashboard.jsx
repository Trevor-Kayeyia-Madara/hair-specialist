import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("profile"); // ✅ Toggle tabs
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

        // Fetch customer details
        const customerRes = await fetch(`https://backend-es6y.onrender.com/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const customerData = await customerRes.json();
        if (!customerRes.ok) throw new Error("Failed to fetch customer data");
        setCustomer(customerData);

        // ✅ Fetch appointments for this customer
        const appointmentsRes = await fetch(`https://backend-es6y.onrender.com/api/customers/${id}/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointmentsData = await appointmentsRes.json();
        if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments");
        setAppointments(appointmentsData);
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
            <button
              onClick={() => setSelectedTab("profile")}
              className={`block w-full text-left py-2 px-4 rounded ${
                selectedTab === "profile" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              👤 Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedTab("appointments")}
              className={`block w-full text-left py-2 px-4 rounded ${
                selectedTab === "appointments" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              📅 Appointments
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
        {/* ✅ Profile Section */}
        {selectedTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Welcome, {user.full_name}</h2>
            <p className="text-gray-600 text-center md:text-left">User Type: {user.userType}</p>
            <p className="text-gray-600 text-center md:text-left">📞 {customer.phone_number} | 📍 {customer.address}</p>
          </div>
        )}

        {/* ✅ Appointments Section */}
        {selectedTab === "appointments" && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">📅 Your Appointments</h3>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-4">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="p-4 border rounded-lg shadow-sm">
                    <p className="text-lg font-semibold">{appointment.specialist_profile?.full_name} - {appointment.specialist_profile?.speciality}</p>
                    <p className="text-gray-600">📅 {appointment.date} ⏰ {appointment.time}</p>
                    <p className="text-gray-500">Status: <span className="font-semibold">{appointment.status}</span></p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
