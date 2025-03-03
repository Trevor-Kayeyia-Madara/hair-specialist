import { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import jsPDF from 'jspdf';

const InvoiceGenerator = () => {
  const { appointment_id } = useParams();
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const customer_id = queryParams.get("customer_id");
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
  
    const validAppointmentId = parseInt(appointment_id, 10);
    if (isNaN(validAppointmentId) || validAppointmentId <= 0 || !customer_id) {
        setError("⚠️ Invalid appointment request.");
        setLoading(false);
        return;
    }
  
    const validateUser = async () => {
      try {
        const response = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Unauthorized access. Please log in.");
        
        const userData = await response.json();
        if (userData.user.id !== customer_id) {
          throw new Error("Access denied: Invoice does not belong to you.");
        }
        
        fetchAppointment();
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/appointments/${appointment_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch appointment details.");
        
        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    validateUser();
  }, [appointment_id, customer_id]);
  

  // Generate PDF invoice
  const generatePDF = () => {
    if (!appointment) return;

    const doc = new jsPDF();
    doc.text("📜 Invoice", 90, 10);
    doc.text(`Customer ID: ${appointment.customer_id}`, 10, 30);
    doc.text(`Customer: ${appointment.customer_name || "Unknown"}`, 10, 40);
    doc.text(`Specialist: ${appointment.specialist_name || "Unknown"}`, 10, 50);
    doc.text(`Service: ${appointment.service?.name || "Unknown"}`, 10, 60);
    doc.text(`Date: ${appointment.date}`, 10, 70);
    doc.text(`Time: ${appointment.time}`, 10, 80);
    doc.text(`Amount: KES ${appointment.service?.price || "N/A"}`, 10, 90);
    doc.save(`invoice_${appointment_id}.pdf`);
  };

  if (loading) return <p>Loading appointment details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointment) return <p>No appointment found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice for Appointment</h2>
      <div className="border p-4 rounded-lg">
        <p><strong>Customer ID:</strong> {appointment.customer_id}</p>
        <p><strong>Customer:</strong> {appointment.customer_name || "Unknown"}</p>
        <p><strong>Specialist:</strong> {appointment.specialist_name || "Unknown"}</p>
        <p><strong>Service:</strong> {appointment.service?.name || "Unknown"}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Amount:</strong> KES {appointment.service?.price || "N/A"}</p>
      </div>
      <button onClick={generatePDF} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Download PDF
      </button>
    </div>
  );
};

export default InvoiceGenerator;
