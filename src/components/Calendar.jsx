import PropTypes from "prop-types";

const Calendar = ({ availableDates, selectedDate, onDateSelect }) => {
  return (
    <div>
      {availableDates.map((date, index) => (
        <button
          key={index}
          className={`p-2 border ${selectedDate && selectedDate.getTime() === date.getTime() ? "bg-blue-500 text-white" : "bg-white"}`}
          onClick={() => onDateSelect(date)}
        >
          {date.toDateString()}
        </button>
      ))}
    </div>
  );
};

Calendar.propTypes = {
  availableDates: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
};

export default Calendar;
