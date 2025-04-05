import PropTypes from "prop-types";

const ReviewsCard = ({ review }) => {
  const { 
    rating, 
    review_text, 
    created_at, 
    specialist_name, 
    reviewer_name,  // Assuming you have a reviewer's name
    reviewer_image, // Assuming you have a reviewer's image URL
    specialist_services, // Assuming this is a field in the review (e.g., the services the specialist provides)
  } = review;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 font-roboto">
      {/* Reviewer's info section */}
      <div className="flex items-center mb-4">
        <img 
          src={reviewer_image || '/default-avatar.png'} 
          alt={reviewer_name} 
          className="w-10 h-10 rounded-full mr-3" 
        />
        <div>
          <h3 className="font-bold text-lg text-gray-900">{reviewer_name}</h3>
          <span className="text-sm text-gray-500">{formatDate(created_at)}</span>
        </div>
      </div>

      {/* Specialist name */}
      <div className="mb-3">
        <h4 className="font-medium text-gray-800">Specialist: {specialist_name}</h4>
        <p className="text-gray-600 text-sm">{specialist_services}</p> {/* Additional info */}
      </div>

      {/* Rating section */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`fas fa-star text-sm ${index < rating ? "text-blue-400" : "text-gray-200"}`}
          ></i>
        ))}
      </div>

      {/* Review text */}
      <p className="text-gray-600 leading-relaxed">{review_text}</p>
    </div>
  );
};

ReviewsCard.propTypes = {
  review: PropTypes.shape({
    rating: PropTypes.number.isRequired,
    review_text: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    specialist_name: PropTypes.string.isRequired,
    reviewer_name: PropTypes.string.isRequired,  // Reviewer's name
    reviewer_image: PropTypes.string,           // Reviewer's image URL
    specialist_services: PropTypes.string,     // Specialist services provided
  }).isRequired,
};

export default ReviewsCard;
