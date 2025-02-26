import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const InvoiceGenerator = () => {
  const { appointmentId } = useParams(); // Get appointmentId from URL params
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) {
      setError("⚠️ Invalid appointment ID.");
      setLoading(false);
      return;
    }

    const fetchAppointment = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/appointments/${appointmentId}`);
        if (!response.ok) throw new Error("Failed to fetch appointment");
        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        setError("❌ Error fetching appointment details. Try again later.");
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const generatePDF = () => {
    if (!appointment) return;

    const doc = new jsPDF();
    doc.text("📜 Invoice", 90, 10);
    doc.text(`Customer: ${appointment.customer_name}`, 10, 30);
    doc.text(`Service: ${appointment.service?.name || "Unknown"}`, 10, 40);
    doc.text(`Date: ${appointment.date}`, 10, 50);
    doc.text(`Time: ${appointment.time}`, 10, 60);
    doc.text(`Amount: KES ${appointment.service?.price || "N/A"}`, 10, 70);
    doc.save(`invoice_${appointmentId}.pdf`);
  };

  if (loading) return <p>Loading appointment details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointment) return <p>No appointment found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice for Appointment</h2>
      <div className="border p-4 rounded-lg">
        <p><strong>Customer:</strong> {appointment.customer_name}</p>
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
