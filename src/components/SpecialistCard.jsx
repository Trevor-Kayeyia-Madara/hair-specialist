import PropTypes from 'prop-types';

const SpecialistCard = ({ specialist }) => {
  const {
    id,
    speciality,
    service_rates,
    location,
    created_at,
  } = specialist;

  return (
    <div className="specialist-card">
      <h2>{speciality}</h2>
      <p><strong>Service Rates:</strong> {service_rates}</p>
      <p><strong>Location:</strong> {location}</p>
      <p><strong>Joined On:</strong> {new Date(created_at).toLocaleDateString()}</p>
      <a href={`/booking/${id}`} className="book-now">Book Now</a>
    </div>
  );
};

// ✅ Define PropTypes for validation
SpecialistCard.propTypes = {
  specialist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    speciality: PropTypes.string.isRequired,
    service_rates: PropTypes.string,
    location: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default SpecialistCard;
