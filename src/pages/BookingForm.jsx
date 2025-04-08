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

  const [customerName, setCustomerName] = useState("");
  const [specialistName, setSpecialistName] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [servicePrice, setServicePrice] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  // 📄 Generate PDF Invoice
  const generateInvoicePDF = (details) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📄 Appointment Invoice", 14, 22);

    doc.setFontSize(12);
    doc.text(`Customer: ${details.customerName}`, 14, 35);
    doc.text(`Specialist: ${details.specialistName}`, 14, 42);
    doc.text(`Service: ${details.selectedService}`, 14, 49);
    doc.text(`Price: KES ${details.servicePrice}`, 14, 56);
    doc.text(`Date: ${details.date}`, 14, 63);
    doc.text(`Time: ${details.time}`, 14, 70);
    doc.text(`Status: ${details.status}`, 14, 77);
    doc.text(`Invoice ID: INV-${details.appointmentId}`, 14, 84);
    doc.line(14, 89, 196, 89);

    doc.save(`Invoice_${details.appointmentId}.pdf`);
  };

  // Fetch logged-in user details
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
        toast.error("❌ Failed to fetch user info.");
      }
    };

    fetchUser();
  }, []);

  // Fetch specialist and services
  useEffect(() => {
    if (!id) return toast.error("⚠️ Invalid Specialist ID");

    const fetchData = async () => {
      try {
        const res = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        const specialist = await res.json();
        setSpecialistName(specialist.full_name);

        const servicesRes = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}/services`);
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      } catch (err) {
        toast.error("❌ Could not load specialist or services.");
      }
    };

    fetchData();
  }, [id]);

  // Handle form submit
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
      const res = await fetch("https://backend-es6y.onrender.com/api/appointments", {
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

      const result = await res.json();
      toast.success("✅ Appointment booked!");

      // Generate Invoice
      generateInvoicePDF({
        appointmentId: result.appointment.id,
        customerName,
        specialistName,
        selectedService,
        servicePrice,
        date,
        time,
        status: "Pending Payment",
      });

      // Redirect to review form
      setTimeout(() => {
        navigate("/review-form", {
          state: {
            appointmentId: result.appointment.id,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      {loading && <Loader />}
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
          📅 Book Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={customerName}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-100"
            />
          </div>

          {/* Specialist Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Specialist Name</label>
            <input
              type="text"
              value={specialistName}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-100"
            />
          </div>

          {/* Service Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700">Service</label>
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                const selected = services.find((s) => s.id === parseInt(e.target.value));
                setServicePrice(selected?.prices || 0);
              }}
              className="w-full mt-1 px-4 py-3 rounded-xl border"
              required
            >
              <option value="">-- Select a service --</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - KES {service.prices}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
