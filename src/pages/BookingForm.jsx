import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingForm = () => {
  const { id } = useParams(); // Ensure id is always available
  const navigate = useNavigate();
  const [specialistName, setSpecialistName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setMessage("⚠️ Invalid specialist ID.");
      return;
    }

    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        if (!response.ok) throw new Error("Specialist not found");
        const data = await response.json();
        setSpecialistName(data.full_name || "Unknown Specialist");
      } catch (error) {
        setSpecialistName("Unknown Specialist");
        console.error("Error fetching specialist:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/services?specialistId=${id}`);
        if (!response.ok) throw new Error("Services not found");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchSpecialist();
    fetchServices();
  }, [id]);

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
          specialist_id: id, // Navigate using specialist ID
          service_id: selectedService,
          date,
          time,
          status: "Pending",
        }),
      });
  
      if (!response.ok) throw new Error("Booking failed");
  
      setMessage("✅ Appointment booked successfully!");
      console.log("Navigating with SpecialistID:", id);
      navigate(`/invoice/${id}`); // Navigate using SpecialistID
  
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">📅 Book an Appointment</h2>

        {message && (
          <p className={`text-center p-3 rounded-lg ${message.includes("⚠️") || message.includes("❌") ? "bg-red-100" : "bg-green-100"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" required className="w-full p-3 border rounded-lg" />
          <input type="text" value={specialistName} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required className="w-full p-3 border rounded-lg">
            <option value="">Select Service</option>
            {services.length > 0 ? (
              services.map((service) => (
                <option key={service.id} value={service.id}>{service.name} - KES{service.price}</option>
              ))
            ) : (
              <option disabled>No services available</option>
            )}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full p-3 border rounded-lg" />

          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded-lg">
            {loading ? "Booking..." : "📌 Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
