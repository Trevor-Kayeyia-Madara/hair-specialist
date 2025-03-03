import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";


const BookingForm = () => {
  const { specialistId } = useParams();
  const [specialist, setSpecialist] = useState("");
  const [customer, setCustomer] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Session expired");
        const data = await response.json();
        setCustomer(data.user.full_name);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`/api/specialists/${specialistId}`);
        if (!response.ok) throw new Error("Specialist not found");
        const data = await response.json();
        setSpecialist(data.full_name);
        setServices(data.services);
      } catch (error) {
        console.error("Error fetching specialist:", error);
      }
    };

    fetchSpecialist();
  }, [specialistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          customer_id: customer,
          specialist_id: specialistId,
          service_id: selectedService,
          date,
          time,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Booking failed");
      const data = await response.json();

      await fetch(`/api/appointments/${data.appointment_id}/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ status: "Booked" }),
      });

      setAppointment({ ...data, status: "Booked" });
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    if (!appointment) return;
    const doc = new jsPDF();
    doc.text("Invoice", 90, 10);
    doc.text(`Customer: ${customer}`, 10, 30);
    doc.text(`Specialist: ${specialist}`, 10, 40);
    doc.text(`Service: ${selectedService}`, 10, 50);
    doc.text(`Date: ${date}`, 10, 60);
    doc.text(`Time: ${time}`, 10, 70);
    doc.save(`invoice_${appointment.id}.pdf`);
  };

  if (appointment) {
    return (
      <div className="confirmation-container">
        <h2>🎉 Booking Confirmed!</h2>
        <p>Your appointment is booked.</p>
        <button onClick={downloadInvoice}>Download Invoice</button>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h2>📅 Book an Appointment</h2>
      {message && <p className="error">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={customer} readOnly />
        <input type="text" value={specialist} readOnly />
        <select onChange={(e) => setSelectedService(e.target.value)} required>
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
        <input type="date" onChange={(e) => setDate(e.target.value)} required />
        <input type="time" onChange={(e) => setTime(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Booking..." : "📌 Book Now"}</button>
      </form>
    </div>
  );
};
export default BookingForm;