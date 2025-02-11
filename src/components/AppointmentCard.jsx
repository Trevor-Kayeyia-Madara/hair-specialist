import PropTypes from "prop-types";

const AppointmentCard = ({
    appointment = {
        date: "",
        time: "",
        service: "",
        status: "upcoming",
        specialist: {
            name: "",
            image: "",
        },
    },
    onReschedule = () => {},
    onCancel = () => {},
}) => {
    const statusColors = {
        upcoming: "text-blue-600 bg-blue-50",
        completed: "text-gray-400 bg-gray-50",
    };

    return (
        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-playfair text-xl mb-2">{appointment.service}</h3>
                    <div className="font-montserrat text-gray-600">
                        <p className="flex items-center">
                            <i className="fas fa-calendar-alt mr-2"></i>
                            {appointment.date}
                        </p>
                        <p className="flex items-center">
                            <i className="fas fa-clock mr-2"></i>
                            {appointment.time}
                        </p>
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-montserrat ${statusColors[appointment.status]}`}
                >
                    {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                </span>
            </div>

            <div className="flex items-center mb-4">
                <img
                    src={appointment.specialist.image}
                    alt={`${appointment.specialist.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <span className="font-montserrat text-gray-700">
                    {appointment.specialist.name}
                </span>
            </div>

            {appointment.status === "upcoming" && (
                <div className="flex space-x-2">
                    <button
                        onClick={onReschedule}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors font-montserrat"
                    >
                        Reschedule
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors font-montserrat"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        service: PropTypes.string.isRequired,
        status: PropTypes.oneOf(["upcoming", "completed"]).isRequired,
        specialist: PropTypes.shape({
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    onReschedule: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AppointmentCard;
