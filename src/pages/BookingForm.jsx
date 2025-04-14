/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BookingForm = () => {
  const { id } = useParams(); // Specialist ID
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // Changed from customerName to userName
  const [specialistName, setSpecialistName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧾 Generate PDF Invoice
  const generateInvoicePDF = (details) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📄 Appointment Invoice", 14, 22);

    doc.setFontSize(12);
    doc.text(`User: ${details.customerName}`, 14, 35); // Changed from customerName to userName
    doc.text(`Specialist: ${details.specialistName}`, 14, 42);
    doc.text(`Service: ${details.selectedService}`, 14, 49);
    doc.text(`Price: KES ${details.servicePrice}`, 14, 56);
    doc.text(`Date: ${details.date}`, 14, 63);
    doc.text(`Time: ${details.time}`, 14, 70);
    doc.text(`Status: ${details.status}`, 14, 77);
    doc.text(`Invoice ID: INV-${details.appointmentId}`, 14, 84);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(14, 89, 196, 89);

    doc.save(`Invoice_${details.appointmentId}.pdf`);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserName(data.user.full_name); // Changed from customerName to userName
        localStorage.setItem("userId", data.user.id); // Changed from customerId to userId
      } catch (err) {
        toast.error("❌ Failed to fetch user details.");
      }
    };

    fetchUser();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId"); // Changed from customerId to userId

    if (!userId || !selectedService || !date || !time) {
      toast.warning("⚠️ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const bookingRes = await fetch("https://backend-es6y.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId, // Changed from customer_id to user_id
          specialist_id: id,
          service_id: selectedService,
          date,
          time,
          status: "Booked",
        }),
      });

      const bookingData = await bookingRes.json();
      toast.success("✅ Appointment booked!");

      // 📄 Generate invoice PDF
      generateInvoicePDF({
        appointmentId: bookingData.appointment.id,
        userName, // Changed from customerName to userName
        specialistName,
        selectedService,
        servicePrice,
        date,
        time,
        status: "Pending Payment",
      });
      setTimeout(() => {
        navigate("/review-form", {
          state: {
            appointmentId: bookingData.appointment.id,
            userId, // Changed from customerId to userId
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      {loading && <Loader />}
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8">
          📅 Book Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Name */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
            <input
              type="text"
              id="userName"
              value={userName} // Changed from customerName to userName
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100 text-gray-700"
            />
          </div>
  
          {/* Specialist Name */}
          <div>
            <label htmlFor="specialistName" className="block text-sm font-medium text-gray-700 mb-1">Specialist Name</label>
            <input
              type="text"
              id="specialistName"
              value={specialistName}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100 text-gray-700"
            />
          </div>
  
          {/* Service Selection */}
          <div>
            <label htmlFor="selectedService" className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
            <select
              id="selectedService"
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                const service = services.find((s) => s.id === parseInt(e.target.value));
                setServicePrice(service?.prices || 0);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-gray-700"
              required
            >
              <option value="">-- Select a service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - KES {s.prices}
                </option>
              ))}
            </select>
          </div>
  
          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="w-full">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;