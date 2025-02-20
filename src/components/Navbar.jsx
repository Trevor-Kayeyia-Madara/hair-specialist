import { useState } from "react";
import PropTypes from "prop-types";

const Navbar = ({ isLoggedIn, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="font-playfair text-2xl text-white">
              Hair Specialist Finder
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white hover:text-blue-100 transition-colors">
              Home
            </a>
            <a href="/search" className="text-white hover:text-blue-100 transition-colors">
              Search
            </a>
            <a href="/booking" className="text-white hover:text-blue-100 transition-colors">
              Appointments
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <a href="/login" className="text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors">
                  Login
                </a>
                <a href="/sign-up" className="text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </a>
              </>
            ) : (
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <a href="/user-dashboard" className="flex items-center space-x-2 text-white">
                    <img src={userProfile?.avatar || "/default-avatar.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
                    <span>{userProfile?.name || "Dashboard"}</span>
                  </a>
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
                    <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Profile
                    </a>
                    <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Settings
                    </a>
                    <a href="/logout" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Logout
                    </a>
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
            <a href="/" className="block text-white py-2">
              Home
            </a>
            <a href="/search" className="block text-white py-2">
              Search
            </a>
            <a href="/booking" className="block text-white py-2">
              Appointments
            </a>
            {!isLoggedIn ? (
              <div className="mt-4 space-y-2">
                <a href="/login" className="block text-center text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg">
                  Login
                </a>
                <a href="/sign-up" className="block text-center text-blue-600 bg-white hover:bg-blue-50 px-4 py-2 rounded-lg">
                  Sign Up
                </a>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <a href="/user-dashboard" className="text-white py-2 flex items-center space-x-2">
                  <img src={userProfile?.avatar || "/default-avatar.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
                  <span>{userProfile?.name || "Dashboard"}</span>
                </a>
                <a href="/profile" className="block text-white py-2">
                  Profile
                </a>
                <a href="/settings" className="block text-white py-2">
                  Settings
                </a>
                <a href="/logout" className="block text-white py-2">
                  Logout
                </a>
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
    avatar: "/default-avatar.jpg",
    name: "User"
  }
};

export default Navbar;