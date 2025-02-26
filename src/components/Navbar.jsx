import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage when Navbar mounts
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold">
            Hair Specialist Finder
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:underline">Home</Link>

            {/* Show Dashboard only if userId exists */}
            {userId && (
              <Link to={`/customer-dashboard/${userId}`} className="text-white hover:underline">
                Dashboard
              </Link>
            )}

            {/* Show Login/Signup if not logged in */}
            {!userId ? (
              <>
                <Link to="/login" className="text-white hover:underline">Login</Link>
                <Link to="/sign-up" className="text-white hover:underline">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-white hover:underline">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
