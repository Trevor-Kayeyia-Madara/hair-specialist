import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
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

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div className="text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome, {user.full_name}</h2>
        <p className="text-gray-600 text-center">User Type: {user.userType}</p>
        <div className="mt-4">
          <p>Email: {user.email}</p>
          <p>Account ID: {id}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
