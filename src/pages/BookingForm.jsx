import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialistName, setSpecialistName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [appointmentData, setAppointmentData] = useState(null);
  const [customerId, setCustomerId] = useState("");

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
        setCustomerId(data.user.id);  // ✅ Store customer_id in state
      } catch (error) {
        console.error("Error fetching user details:", error); // ✅ Logs the error
        setMessage("❌ Error fetching user details. Please log in again.");
      }
    };

    fetchUserProfile();
  }, []);

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
        setSpecialistName(data.full_name);

        const servicesResponse = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}/services`);
        if (!servicesResponse.ok) throw new Error("Services not found");
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching user details:", error); // ✅ Logs the error
        setMessage("❌ Error loading data. Please try again.");
      }
    };

    fetchSpecialistDetails();
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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: customerId,  // ✅ Now properly defined
          customer_name: customerName,
          specialist_id: id,
          service_id: selectedService,
          date,
          time,
          status: "Pending", // Initially set to "Pending"
        }),
      });
  
      if (!response.ok) throw new Error("Booking failed");
      const data = await response.json();
  
      // Update status to "Booked" after successful booking
      await fetch(`https://backend-es6y.onrender.com/api/appointments/${data.appointment_id}/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Booked" }),
      });
  
      setAppointmentData({ ...data, status: "Booked" });
      setMessage("✅ Appointment booked successfully!");
    } catch (error) {
    
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (appointmentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 space-y-6 text-center">
          <h2 className="text-3xl font-bold">🎉 Booking Confirmed!</h2>
          <p className="text-lg">Your appointment has been successfully booked.</p>
          <button onClick={() => navigate(`/invoice/${appointmentData.appointment_id}?customer_id=${appointmentData.customer_id}`)}
            className="w-full bg-green-500 text-white py-3 rounded-lg">
            📜 View Invoice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
    <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">📅 Book an Appointment</h2>
      {message && <p className="text-center p-3 rounded-lg bg-red-100">{message}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" value={customerName} readOnly className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700" />
        <input type="text" value={specialistName} readOnly className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700" />
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required className="w-full p-3 border rounded-lg">
          <option value="">Select Service</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>{service.name} - KES {service.prices}</option>
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
