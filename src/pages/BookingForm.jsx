import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const { id: specialistId } = useParams();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [specialistName, setSpecialistName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to validate session");

        const data = await response.json();
        const userId = data.userId; // Logged-in user ID
        setCustomerId(userId);

        // Fetch customer details
        const customerResponse = await fetch(`https://backend-es6y.onrender.com/api/customers/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!customerResponse.ok) throw new Error("Customer profile not found");

        const customerData = await customerResponse.json();
        setCustomerName(customerData.full_name);
      } catch (err) {
        toast.error(`❌ ${err.message}`);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!specialistId) {
      toast.warning("⚠️ Invalid specialist ID.");
      return;
    }

    const fetchSpecialistDetails = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${specialistId}`);
        if (!response.ok) throw new Error("Specialist not found");

        const data = await response.json();
        setSpecialistName(data.full_name);

        const servicesResponse = await fetch(`https://backend-es6y.onrender.com/api/specialists/${specialistId}/services`);
        if (!servicesResponse.ok) throw new Error("Services not found");

        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (err) {
        toast.error(`❌ ${err.message}`);
      }
    };

    fetchSpecialistDetails();
  }, [specialistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!customerId || !date || !time || !selectedService) {
      toast.warning("⚠️ Please fill in all fields.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.warning("⚠️ You must be logged in to book an appointment.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://backend-es6y.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          specialist_id: specialistId,
          service_id: selectedService,
          date,
          time,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Booking failed");
      const data = await response.json();

      toast.success("✅ Appointment booked successfully!");

      // Navigate to Invoice Page
      navigate("/invoice", {
        state: {
          appointmentId: data.appointment.id,
          customerName,
          specialistName,
          selectedService,
          servicePrice,
          date,
          time,
        },
      });

      // Redirect to Payment Page
      setTimeout(() => {
        navigate("/payment");
      }, 5000);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">📅 Book an Appointment</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" value={customerName} readOnly className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700" />
          <input type="text" value={specialistName} readOnly className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700" />
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              const selected = services.find((s) => s.id === parseInt(e.target.value));
              setServicePrice(selected ? selected.prices : 0);
            }}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - KES {service.prices}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="flex-1 p-3 border rounded-lg" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="flex-1 p-3 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            {loading ? "Booking..." : "📌 Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
