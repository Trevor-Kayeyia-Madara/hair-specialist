import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [editForm, setEditForm] = useState({ full_name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
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
        setEditForm({ full_name: result.full_name, email: result.email });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [id, navigate]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`https://backend-es6y.onrender.com/api/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: editForm.full_name, email: editForm.email }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Profile Update Error:", err.message);
    }
  };

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
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">👤 Your Profile</h2>
          {!isEditing ? (
            <>
              <p><strong>Full Name:</strong> {user.full_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User Type:</strong> {user.userType}</p>
              <button onClick={() => setIsEditing(true)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
                required
              />
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              <button onClick={() => setIsEditing(false)} className="ml-2 px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
