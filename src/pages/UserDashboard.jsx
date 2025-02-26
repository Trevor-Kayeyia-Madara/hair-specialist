import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Menu, X, Home, Calendar, MessageCircle, LogOut } from "lucide-react"; // Icons for better UI

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-blue-600 text-white flex items-center justify-between px-5 py-4 shadow-md">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-blue-700 text-white w-64 p-6 transform md:relative md:translate-x-0 md:flex transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Dashboard</h2>
        <ul className="space-y-5">
          <li>
            <Link to="/" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-600 transition">
              <Home size={20} /> Home
            </Link>
          </li>
          <li>
            <button
              onClick={() => navigate(`/customer-dashboard/${id}/appointments`)}
              className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              <Calendar size={20} /> Appointments
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate(`/customer-dashboard/${id}/messages`)}
              className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              <MessageCircle size={20} /> Messages
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition"
            >
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay for Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-3xl font-semibold text-blue-700 mb-4 text-center md:text-left">
            Welcome, {user.full_name}
          </h2>
          <p className="text-gray-600 text-center md:text-left text-lg">User Type: {user.userType}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
