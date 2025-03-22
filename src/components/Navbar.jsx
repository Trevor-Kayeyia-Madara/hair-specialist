import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-extrabold">
          Hair Specialist Finder
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white text-lg hover:text-blue-200 transition duration-300">
            Home
          </Link>

          {userId && (
            <Link
              to={`/customer-dashboard/${userId}`}
              className="text-white text-lg hover:text-blue-200 transition duration-300"
            >
              Dashboard
            </Link>
          )}
          {userId && (
            <Link
              to={`/chat`}
              className="text-white text-lg hover:text-blue-200 transition duration-300"
            >
              Chat
            </Link>
          )}

          {!userId ? (
            <>
              <Link to="/login" className="text-white text-lg hover:text-blue-200 transition duration-300">
                Login
              </Link>
              <Link to="/sign-up" className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 py-4">
          <div className="flex flex-col items-center space-y-4">
            <Link to="/" className="text-white text-lg hover:text-blue-200" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            {userId && (
              <Link
                to={`/customer-dashboard/${userId}`}
                className="text-white text-lg hover:text-blue-200"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
             {userId && (
            <Link
              to={`/chat`}
              className="text-white text-lg hover:text-blue-200 transition duration-300"
            >
              Chat
            </Link>
          )}
            {!userId ? (
              <>
                <Link to="/login" className="text-white text-lg hover:text-blue-200" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
