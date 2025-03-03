import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingForm = () => {
  const { id } = useParams();  // Specialist ID from URL params
  const navigate = useNavigate();
  const [specialistName, setSpecialistName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [services, setServices] = useState([]); // Store services based on speciality
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch logged-in user details
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setCustomerName(data.user.full_name);  // Auto-fill customer name
      } catch (error) {
        console.error("Error fetching user:", error);
        setMessage("❌ Error fetching user details. Please log in again.");
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch specialist details and related services
  useEffect(() => {
    if (!id) {
      setMessage("⚠️ Invalid specialist ID.");
      return;
    }

    const fetchSpecialistDetails = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        if (!response.ok) throw new Error("Specialist not found");

        const data = await response.json();

        if (!data || !data.full_name) {
          throw new Error("Specialist name is missing from the response");
        }

        setSpecialistName(data.full_name);  // ✅ Now properly sets the name

        // Fetch services based on the specialist's speciality
        const servicesResponse = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}/services`);
        if (!servicesResponse.ok) throw new Error("Services not found");
        const servicesData = await servicesResponse.json();
        setServices(servicesData); // Update services state

      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("❌ Error loading data. Please try again.");
      }
    };

    fetchSpecialistDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate the inputs
    if (!customerName || !date || !time || !selectedService) {
      setMessage("⚠️ Please fill in all fields.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("⚠️ You must be logged in to book an appointment.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://backend-es6y.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          customer_name: customerName,
          specialist_id: id,
          service_id: selectedService,
          date,
          time,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      const appointmentData = await response.json(); // Assuming the response contains appointment details
      setMessage("✅ Appointment booked successfully!");

      // Assuming the response contains customer details, you could pass customer ID to the invoice route.
      navigate(`/invoice/${appointmentData.customer_id}`);

    } catch (error) {
      console.error("Booking error:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">📅 Book an Appointment</h2>

        {message && <p className="text-center p-3 rounded-lg bg-red-100">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={customerName} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
          <input type="text" value={specialistName} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required className="w-full p-3 border rounded-lg">
            <option value="">Select Service</option>
            {services.length > 0 ? (
              services.map(service => (
                <option key={service.id} value={service.id}>{service.name} - KES{service.prices}</option>
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