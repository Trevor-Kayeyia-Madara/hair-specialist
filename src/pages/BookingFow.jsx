/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const BookingForm = ({ customerId, services }) => {
  const { specialistId } = useParams();
  const [formData, setFormData] = useState({
    service_id: "",
    date: "",
    time: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const appointmentData = {
      customer_id: customerId,
      specialist_id: parseInt(specialistId),
      service_id: parseInt(formData.service_id),
      date: formData.date,
      time: formData.time,
      status: formData.status,
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg p-6 rounded-lg border">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
      {message && (
        <p className={`text-sm mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700">Service:
          <select name="service_id" value={formData.service_id} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-gray-700">Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border p-2 rounded" />
        </label>

        <label className="block text-gray-700">Time:
          <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full border p-2 rounded" />
        </label>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

BookingForm.propTypes = {
  customerId: PropTypes.number.isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BookingForm;
