import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Import icons for the menu

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  // const [appointments, setAppointments] = useState([]);
  // const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

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

    fetchUserProfile();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
  if (!user) return <div className="text-center text-lg font-semibold mt-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 text-white flex items-center justify-between px-4 py-3 shadow-md">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar (Hidden on Mobile by Default) */}
      <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-6 transform md:relative md:translate-x-0 md:flex transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
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

      {/* Overlay for Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 md:ml-64">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
          Welcome, {user.full_name}
        </h2>
        <p className="text-gray-600 text-center md:text-left">User Type: {user.userType}</p>
      </div>
    </div>
  );
};

export default UserDashboard;
