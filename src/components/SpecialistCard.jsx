import PropTypes from "prop-types";

const SpecialistCard = ({ specialist }) => {
  const { id, full_name, speciality, service_rates, location, created_at } =
    specialist;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-bold text-gray-800">{full_name}</h2>
      <p className="text-sm text-gray-600">{speciality}</p>

      <div className="mt-4">
        <p className="text-gray-700">
          <strong>Service Rates:</strong> {service_rates || "Not specified"}
        </p>
        <p className="text-gray-700">
          <strong>Location:</strong> {location || "Not specified"}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Joined On:</strong> {new Date(created_at).toLocaleDateString()}
        </p>
      </div>

      <a
        href={`/booking/${id}`}
        className="mt-4 block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Book Now
      </a>
    </div>
  );
};

// ✅ Define PropTypes for validation
SpecialistCard.propTypes = {
  specialist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string.isRequired,
    speciality: PropTypes.string.isRequired,
    service_rates: PropTypes.string,
    location: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default SpecialistCard;
