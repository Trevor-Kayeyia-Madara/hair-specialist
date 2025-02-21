import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Calendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const fetchBookedDates = async () => {
    try {
      const response = await fetch("https://backend-es6y.onrender.com/api/booked-dates");
      if (!response.ok) throw new Error("Failed to fetch booked dates");
      const data = await response.json();
      setBookedDates(data.map((date) => new Date(date)));
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = Array(firstDayOfMonth).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isDateBooked = (date) =>
    bookedDates.some((bookedDate) => bookedDate.toDateString() === date.toDateString());

  const handlePrevMonth = () =>
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));

  const handleNextMonth = () =>
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
          ← Prev
        </button>
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
          Next →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
        {getDaysInMonth(currentMonth).map((date, index) => (
          <button
            key={index}
            onClick={() => date && !isDateBooked(date) && onDateSelect(date)}
            disabled={!date || isDateBooked(date)}
            className={`aspect-square p-2 text-center rounded-lg transition-colors
              ${!date ? "invisible" : ""}
              ${selectedDate && date && date.toDateString() === selectedDate.toDateString() ? "bg-blue-700 text-white" : ""}
              ${date && !isDateBooked(date) ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
            `}
          >
            {date ? date.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};
// Define PropTypes for validation
Calendar.propTypes = {
  availableDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  selectedDate: PropTypes.instanceOf(Date), // Ensure selectedDate is validated
  onDateSelect: PropTypes.func.isRequired, // Ensure onDateSelect is validated
};
export default Calendar;
