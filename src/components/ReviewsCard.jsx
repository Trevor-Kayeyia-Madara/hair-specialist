import PropTypes from "prop-types";

const ReviewsCard = ({ review }) => {
  const {
    rating,
    review_text,
    created_at,
    specialist_name,
    reviewer_name,
    specialist_services,
  } = review;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      {/* Reviewer Information */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{reviewer_name}</h3>
        <span className="text-sm text-gray-500">{formatDate(created_at)}</span>
      </div>

      {/* Specialist Information */}
      <div className="mb-3">
        <h4 className="text-lg font-medium text-gray-800">Specialist: {specialist_name}</h4>
        <p className="text-sm text-gray-600">Services: {specialist_services}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`fas fa-star text-lg ${
              index < rating ? "text-yellow-500" : "text-gray-300"
            }`}
          ></i>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed">{review_text}</p>
    </div>
  );
};

ReviewsCard.propTypes = {
  review: PropTypes.shape({
    rating: PropTypes.number.isRequired,
    review_text: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    specialist_name: PropTypes.string.isRequired,
    reviewer_name: PropTypes.string.isRequired,
    specialist_services: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewsCard;
