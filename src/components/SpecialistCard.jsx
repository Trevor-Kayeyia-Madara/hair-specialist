import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SpecialistCard = ({ specialist }) => {
  const { id, full_name, speciality, rating, location, created_at } = specialist;

  // Ensure id is always a string (important for route matching)
  const specialistId = String(id);

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

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300">
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
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          to={`/booking/${specialistId}`}
          className="block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Book Now
        </Link>
        <Link
          to={`/chat/${specialistId}`}
          className="block text-center bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Chat Now
        </Link>
      </div>
    </div>
  );
};

// ✅ Define PropTypes for validation
SpecialistCard.propTypes = {
  specialist: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Ensure compatibility
    full_name: PropTypes.string.isRequired,
    speciality: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Allow both for conversion
    location: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default SpecialistCard;
