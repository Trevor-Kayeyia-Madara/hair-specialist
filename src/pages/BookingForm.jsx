import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BookingForm = () => {
  const { id } = useParams(); // This is actually the specialist's ID
  const [specialistName, setSpecialistName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Fetch specialist details (name) using the id from params
  useEffect(() => {
    const fetchSpecialistDetails = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        if (!response.ok) throw new Error("Failed to fetch specialist details");
        const data = await response.json();
        setSpecialistName(data.full_name);
      } catch (error) {
        console.error("Error fetching specialist details:", error);
        setSpecialistName("Unknown Specialist");
      }
    };

    fetchSpecialistDetails();
  }, [id]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://backend-es6y.onrender.com/api/services");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      }
    };

    fetchServices();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!customerName || !date || !time || !selectedService) {
      setMessage("⚠️ Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://backend-es6y.onrender.com/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          specialist_id: id, // Use the id directly from params
          service_id: selectedService,
          date,
          time,
          status,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Booking failed");

      setMessage("✅ Appointment booked successfully!");
      setCustomerName("");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">📅 Book an Appointment</h2>

        {message && (
          <p className={`text-center p-3 rounded-lg ${message.includes("⚠️") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Specialist Name</label>
            <input
              type="text"
              value={specialistName}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
              required
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

          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "⏳ Booking..." : "📌 Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
