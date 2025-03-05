import PropTypes from "prop-types";

const ReviewsCard = ({ review }) => {
  const { rating, review_text, created_at } = review;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 font-roboto">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`fas fa-star text-sm ${index < rating ? "text-blue-400" : "text-gray-200"}`}
              ></i>
            ))}
          </div>
        </div>
        <span className="ml-auto text-sm text-gray-500">{formatDate(created_at)}</span>
      </div>
      <p className="text-gray-600 leading-relaxed">{review_text}</p>
    </div>
  );
};

ReviewsCard.propTypes = {
  review: PropTypes.shape({
    rating: PropTypes.number.isRequired,
    review_text: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewsCard;
