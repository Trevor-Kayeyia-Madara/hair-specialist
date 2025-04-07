import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SpecialistCard = ({ specialist, startNewChat }) => {
  const { id, full_name, speciality, rating, location, opening_time, closing_time, created_at } = specialist;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Ensure rating is a float and limit to 1 decimal place
  const formattedRating = rating ? parseFloat(rating).toFixed(1) : "N/A";

  // Generate star icons based on rating (max 5)
  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(rating); // Round to nearest integer

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Handle chat button click
  const handleChatClick = () => {
    console.log("Navigating to Chat with Specialist:", specialist);
    localStorage.setItem("selectedSpecialist", JSON.stringify(specialist));
    navigate("/chat");
    setTimeout(() => startNewChat(specialist.id), 1000);
  };

  // Handle Book Now button click
  const handleBookNowClick = () => {
    const isLoggedIn = !!localStorage.getItem("authToken"); // Check if user is logged in
    if (isLoggedIn) {
      navigate(`/booking/${id}`); // Navigate to booking form
    } else {
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300 relative">
      {/* Ellipsis Button (Top Right) */}
      <div className="absolute top-2 right-2">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-500 hover:text-gray-700">
          ⋮
        </button>

        {/* Dropdown for Chat */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
            <button
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleChatClick}
            >
              Chat
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-800">{full_name}</h2>
      <p className="text-sm text-gray-600">{speciality}</p>

      <div className="mt-4">
        <p className="text-gray-700">
          <strong>Rating:</strong> {formattedRating} {rating !== "N/A" && <span className="ml-2">{renderStars()}</span>}
        </p>
        <p className="text-gray-700">
          <strong>Location:</strong> {location || "Not specified"}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Joined On:</strong> {new Date(created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Opens at:</strong> {opening_time}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Closes by:</strong> {closing_time}
        </p>
      </div>

      {/* "Book Now" Button Below */}
      <div className="mt-4">
        <button
          onClick={handleBookNowClick}
          className="block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// ✅ Define PropTypes for validation
SpecialistCard.propTypes = {
  specialist: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    full_name: PropTypes.string.isRequired,
    speciality: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    opening_time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    closing_time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  startNewChat: PropTypes.func.isRequired,
};

export default SpecialistCard;