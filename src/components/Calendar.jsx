import { useState } from "react";
import PropTypes from "prop-types";

const Calendar = ({
  availableDates = [],
  selectedDate = null,
  onDateSelect = () => {},
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0));

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateAvailable = (date) => {
    return (
      date &&
      availableDates.some(
        (availableDate) => availableDate.toDateString() === date.toDateString()
      )
    );
  };

  const isDateSelected = (date) => {
    return (
      date &&
      selectedDate &&
      date.toDateString() === selectedDate.toDateString()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1);
      return newMonth.getFullYear() === 2025 ? newMonth : prev;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1);
      return newMonth.getFullYear() === 2025 ? newMonth : prev;
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 font-montserrat shadow-md">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={currentMonth.getMonth() === 0}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          ← Prev
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          disabled={currentMonth.getMonth() === 11}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {getDaysInMonth(currentMonth).map((date, index) => (
          <button
            key={index}
            onClick={() => date && onDateSelect(date)}
            disabled={!date || !isDateAvailable(date)}
            className={`aspect-square p-2 text-center rounded-lg transition-colors 
              ${!date ? "invisible" : ""}
              ${isDateSelected(date) ? "bg-blue-700 text-white" : ""}
              ${
                !isDateSelected(date) && isDateAvailable(date)
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {date ? date.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  availableDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func,
};

export default Calendar;
