import PropTypes from "prop-types";

const Calendar = ({ availableDates, selectedDate, onDateSelect }) => {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select an Available Date</h3>
      {availableDates.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {availableDates.map((date, index) => {
            const isSelected = selectedDate && selectedDate.getTime() === date.getTime();

            return (
              <button
                key={index}
                className={`p-2 rounded border text-sm ${
                  isSelected ? "bg-blue-500 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-300"
                } hover:bg-blue-200 transition`}
                onClick={() => onDateSelect(date)}
              >
                {date.toDateString()}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No available dates.</p>
      )}
    </div>
  );
};

Calendar.propTypes = {
  availableDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
};

export default Calendar;
