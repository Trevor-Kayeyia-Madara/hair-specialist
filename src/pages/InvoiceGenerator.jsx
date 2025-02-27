import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import jsPDF from 'jspdf';

const InvoiceGenerator = () => {
  // Get state data passed through the navigation
  const location = useLocation();
  const { appointmentId, customerName, specialistName, date, time, selectedService } = location.state || {};

  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch appointment details when appointmentId is available
  useEffect(() => {
    if (!appointmentId) {
      setError("⚠️ Invalid appointment ID.");
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`https://backend-es6y.onrender.com/api/appointments/${appointmentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details.");
        }

        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        setError(error.message || "❌ Error fetching appointment details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Generate PDF invoice
  const generatePDF = () => {
    if (!appointment) return;

    const doc = new jsPDF();
    doc.text("📜 Invoice", 90, 10);
    doc.text(`Customer ID: ${appointment.customer_id}`, 10, 30); // Added Customer ID
    doc.text(`Customer: ${customerName}`, 10, 40);
    doc.text(`Specialist: ${specialistName}`, 10, 50);
    doc.text(`Service: ${selectedService || "Unknown"}`, 10, 60);
    doc.text(`Date: ${date}`, 10, 70);
    doc.text(`Time: ${time}`, 10, 80);
    doc.text(`Amount: KES ${appointment.service?.price || "N/A"}`, 10, 90);
    doc.save(`invoice_${appointmentId}.pdf`);
  };

  // Loading state and error handling
  if (loading) return <p>Loading appointment details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointment) return <p>No appointment found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice for Appointment</h2>
      <div className="border p-4 rounded-lg">
        <p><strong>Customer ID:</strong> {appointment.customer_id}</p> {/* Display Customer ID */}
        <p><strong>Customer:</strong> {customerName}</p>
        <p><strong>Specialist:</strong> {specialistName}</p>
        <p><strong>Service:</strong> {appointment.service?.name || "Unknown"}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Amount:</strong> KES {appointment.service?.price || "N/A"}</p>
      </div>
      <button onClick={generatePDF} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Download PDF
      </button>
    </div>
  );
};

export default InvoiceGenerator;
