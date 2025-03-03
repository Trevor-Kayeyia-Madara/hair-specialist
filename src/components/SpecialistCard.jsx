import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SpecialistCard = ({ specialist }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }

    // Validate session with API
    fetch("https://your-api-url.com/api/validate-session", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          navigate("/login"); // Redirect if session is invalid
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => navigate("/login")); // Redirect on error
  }, [navigate]);

  if (!isAuthenticated) return null; // Prevent rendering while checking auth

  const { id, full_name, speciality, rating, location, created_at } = specialist;
  const specialistId = String(id);
  const formattedRating = rating ? parseFloat(rating).toFixed(1) : "N/A";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-bold text-gray-800">{full_name}</h2>
      <p className="text-sm text-gray-600">{speciality}</p>
      <div className="mt-4">
        <p className="text-gray-700">
          <strong>Rating:</strong> {formattedRating}
        </p>
        <p className="text-gray-700">
          <strong>Location:</strong> {location || "Not specified"}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Joined On:</strong> {new Date(created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4">
        <Link
          to={`/booking/${specialistId}`}
          className="block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

SpecialistCard.propTypes = {
  specialist: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    full_name: PropTypes.string.isRequired,
    speciality: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default SpecialistCard;
