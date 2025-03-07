import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialistName, setSpecialistName] = useState("");
  const [customerName, setCustomerName] = useState("");
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
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setCustomerName(data.user.full_name);
       // ✅ Ensure customer_id is stored correctly
       if (data.customerId) {
        localStorage.setItem("customerId", data.customerId);
    } else {
        throw new Error("Customer ID not found.");
    }
      } catch (err) { // ✅ Renamed 'error' to 'err' & used it
        toast.error(`❌ Error fetching user details: ${err.message}`);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!id) {
      toast.warning("⚠️ Invalid specialist ID.");
      return;
    }

    const fetchSpecialistDetails = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        if (!response.ok) throw new Error("Specialist not found");

        const data = await response.json();
        setSpecialistName(data.full_name);

        const servicesResponse = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}/services`);
        if (!servicesResponse.ok) throw new Error("Services not found");
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (err) { // ✅ Renamed 'error' to 'err' & used it
        toast.error(`❌ Error loading data: ${err.message}`);
      }
    };

    fetchSpecialistDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const customerId = localStorage.getItem("customerId");

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
          specialist_id: id,
          service_id: selectedService,
          date,
          time,
          status: "Booked",
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
        navigate("/reviews", {
          state: {
              appointmentId: data.appointment.id,
              customerId,  // ✅ Pass customer ID
              specialistId: id,  // ✅ Pass specialist ID
              specialistName
          }
      });
      }, 5000);
    } catch (err) { // ✅ Renamed 'error' to 'err' & used it
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      {loading && <Loader />}
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