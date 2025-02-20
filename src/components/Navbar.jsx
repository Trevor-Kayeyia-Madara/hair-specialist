import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Navbar = ({ isLoggedIn, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="font-playfair text-2xl text-white">
              Hair Specialist Finder
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-100 transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-white hover:text-blue-100 transition-colors">
              Search
            </Link>
            <Link to="/booking" className="text-white hover:text-blue-100 transition-colors">
              Appointments
            </Link>
          </div>

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
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard" className="flex items-center space-x-2 text-white">
                    <img 
                      src={userProfile?.avatar || "/assets/images/avatar.png"} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full" 
                    />
                    <span>{userProfile?.name || "Dashboard"}</span>
                  </Link>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className="text-white focus:outline-none ml-2"
                    aria-expanded={isDropdownOpen}
                    aria-label="User menu"
                  >
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Settings
                    </Link>
                    <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white focus:outline-none"
            aria-expanded={isOpen}
            aria-label="Menu"
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block text-white py-2">
              Home
            </Link>
            <Link to="/search" className="block text-white py-2">
              Search
            </Link>
            <Link to="/booking" className="block text-white py-2">
              Appointments
            </Link>
            {!isLoggedIn ? (
              <div className="mt-4 space-y-2">
                <Link to="/login" className="block text-center text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg">
                  Login
                </Link>
                <Link to="/sign-up" className="block text-center text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link to="/dashboard" className="text-white py-2 flex items-center space-x-2">
                  <img 
                    src={userProfile?.avatar || "/assets/images/avatar.png"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full" 
                  />
                  <span>{userProfile?.name || "Dashboard"}</span>
                </Link>
                <Link to="/profile" className="block text-white py-2">
                  Profile
                </Link>
                <Link to="/settings" className="block text-white py-2">
                  Settings
                </Link>
                <Link to="/logout" className="block text-white py-2">
                  Logout
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// PropTypes validation
Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string
  }),
};

// Default props
Navbar.defaultProps = {
  userProfile: {
    avatar: "/assets/images/avatar.png",
    name: "User"
  }
};

export default Navbar;
