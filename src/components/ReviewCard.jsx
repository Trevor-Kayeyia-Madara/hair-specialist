import PropTypes from "prop-types";

const ReviewCard = ({ review }) => {
  const { text, rating, date, user } = review;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-[350px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 font-roboto">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-50">
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <div className="flex items-center gap-1">
            {[...Array.from({ length: 5 })].map((_, index) => (
              <i
                key={index}
                className={`fas fa-star text-sm ${
                  index < rating ? "text-blue-400" : "text-gray-200"
                }`}
              ></i>
            ))}
          </div>
        </div>
        <span className="ml-auto text-sm text-gray-500">
          {formatDate(date)}
        </span>
      </div>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
};

// ✅ Define PropTypes for validation
ReviewCard.propTypes = {
  review: PropTypes.shape({
    text: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ReviewCard;
