/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const { id } = useParams(); // Specialist ID
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [specialistName, setSpecialistName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch logged-in user's name & ID
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCustomerName(data.user.full_name);
        localStorage.setItem("customerId", data.customerId);
      } catch (err) {
        toast.error("❌ Failed to fetch user details.");
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch specialist + services
  useEffect(() => {
    if (!id) return toast.error("⚠️ Invalid Specialist ID");

    const fetchSpecialist = async () => {
      try {
        const res = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        const data = await res.json();
        setSpecialistName(data.full_name);

        const serviceRes = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}/services`);
        const serviceData = await serviceRes.json();
        setServices(serviceData);
      } catch (err) {
        toast.error("❌ Failed to load specialist/services.");
      }
    };

    fetchSpecialist();
  }, [id]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    const customerId = localStorage.getItem("customerId");

    if (!customerId || !selectedService || !date || !time) {
      toast.warning("⚠️ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // 🕐 Check availability first
      const availabilityRes = await fetch("https://backend-es6y.onrender.com/api/check-availability", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ specialist_id: id, date, time }),
      });

      const availabilityData = await availabilityRes.json();
      if (!availabilityData.available) {
        toast.warning("⛔ Time slot is already booked.");
        setLoading(false);
        return;
      }

      // ✅ Proceed with booking
      const bookingRes = await fetch("https://backend-es6y.onrender.com/api/appointments", {
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

      const bookingData = await bookingRes.json();
      toast.success("✅ Appointment booked!");

      // Navigate to invoice page
      navigate("/invoice", {
        state: {
          appointmentId: bookingData.appointment.id,
          customerName,
          specialistName,
          selectedService,
          servicePrice,
          date,
          time,
        },
      });

      // Optional: redirect to review after delay
      setTimeout(() => {
        navigate("/reviews", {
          state: {
            appointmentId: bookingData.appointment.id,
            customerId,
            specialistId: id,
            specialistName,
          },
        });
      }, 5000);
    } catch (err) {
      toast.error("❌ Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {loading && <Loader />}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">📅 Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={customerName} readOnly className="input" />
          <input type="text" value={specialistName} readOnly className="input" />

          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              const service = services.find((s) => s.id === parseInt(e.target.value));
              setServicePrice(service?.prices || 0);
            }}
            className="input"
            required
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - KES {s.prices}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input w-1/2" required />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input w-1/2" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
            {loading ? "Booking..." : "📌 Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
