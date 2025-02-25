import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const BookingForm = ({ customerId }) => {
  const { specialistId } = useParams();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]); // Ensure services is always an array
      }
    };

    fetchServices();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!date || !time || !selectedService) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          specialist_id: specialistId,
          service_id: selectedService,
          date,
          time,
          status,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Booking failed");

      setMessage("Appointment booked successfully!");
      setDate("");
      setTime("");
      setSelectedService("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Book an Appointment</h2>
      
      {message && <p className="mb-4 text-center text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Selection */}
        <div>
          <label className="block text-gray-700 font-medium">Select Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Choose a service</option>
            {services.length > 0 ? (
              services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))
            ) : (
              <option disabled>No services available</option>
            )}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-gray-700 font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-gray-700 font-medium">Select Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

// PropTypes Validation
BookingForm.propTypes = {
  customerId: PropTypes.number.isRequired,
};

export default BookingForm;
