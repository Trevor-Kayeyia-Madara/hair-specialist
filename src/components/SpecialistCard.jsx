import PropTypes from "prop-types";

const SpecialistCard = ({ specialist }) => {
  const {
    name,
    title,
    image,
    rating,
    specialties,
    location,
    bookingUrl = "/booking",
  } = specialist;

  return (
    <div className="w-[300px] bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden font-montserrat">
      <div className="p-6 flex flex-col items-center">
        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-pink-100">
          <img
            src={image}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">
          {name}
        </h3>

        <p className="text-pink-600 mb-2 text-sm">{title}</p>

        <div className="flex items-center mb-3">
          {[...Array.from({ length: 5 })].map((_, index) => (
            <i
              key={index}
              className={`fas fa-star ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
            ></i>
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {specialties?.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex items-center mb-4 text-gray-600">
          <i className="fas fa-map-marker-alt text-pink-500 mr-2"></i>
          <span className="text-sm">{location}</span>
        </div>

        <a
          href={bookingUrl}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-6 rounded-lg text-center hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
        >
          Book Now
        </a>
      </div>
    </div>
  );
};

// ✅ Define PropTypes for validation
SpecialistCard.propTypes = {
  specialist: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    specialties: PropTypes.arrayOf(PropTypes.string), // ✅ Validate `specialties`
    location: PropTypes.string.isRequired,
    bookingUrl: PropTypes.string,
  }).isRequired,
};

export default SpecialistCard;
