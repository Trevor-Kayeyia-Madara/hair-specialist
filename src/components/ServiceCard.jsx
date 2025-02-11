import PropTypes from 'prop-types';

const ServiceCard = ({ serviceName, price, description, features = [] }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:bg-blue-50 transition-colors max-w-sm w-full">
      <h3 className="font-playfair text-2xl mb-4">{serviceName}</h3>
      <div className="font-montserrat text-3xl font-bold text-blue-600 mb-4">
        ${price}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <i className="fas fa-check text-blue-600 mr-2"></i>
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
        Select
      </button>
    </div>
  );
};

// Define prop types
ServiceCard.propTypes = {
  serviceName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string),
};

export default ServiceCard;
