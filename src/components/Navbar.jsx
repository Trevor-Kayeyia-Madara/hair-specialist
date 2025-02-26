import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // Initialize with stored userId

  useEffect(() => {
    // Update userId whenever authentication status changes
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, [isLoggedIn]); // Depend on isLoggedIn to re-check storage

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null); // Clear userId from state
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="font-playfair text-2xl text-white">
              Hair Specialist Finder
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-100 transition-colors">
              Home
            </Link>
            {isLoggedIn && userId && (
              <Link to={`/customer-dashboard/${userId}`} className="text-white hover:text-blue-100 transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors">
                  Login
                </Link>
                <Link to="/sign-up" className="text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-white hover:text-blue-100 transition-colors">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// PropTypes validation
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Navbar;
