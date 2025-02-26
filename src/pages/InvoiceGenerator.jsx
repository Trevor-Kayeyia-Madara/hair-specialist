import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const InvoiceGenerator = () => {
  const { specialistId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!specialistId || specialistId === "undefined") {
      setError("⚠️ Invalid specialist ID.");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/appointments?specialistId=${specialistId}`);
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError("❌ Error fetching appointments. Try again later.");
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [specialistId]);

  const generatePDF = () => {
    if (!selectedAppointment) return;

    const doc = new jsPDF();
    doc.text("📜 Invoice", 90, 10);
    doc.text(`Customer: ${selectedAppointment.customer_name}`, 10, 30);
    doc.text(`Service: ${selectedAppointment.service?.name || "Unknown"}`, 10, 40);
    doc.text(`Date: ${selectedAppointment.date}`, 10, 50);
    doc.text(`Time: ${selectedAppointment.time}`, 10, 60);
    doc.text(`Amount: KES ${selectedAppointment.service?.price || "N/A"}`, 10, 70);
    doc.save("invoice.pdf");
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointments.length) return <p>Loading or No Appointments Found...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Select Appointment for Invoice</h2>
      <select
        onChange={(e) => {
          const appointment = appointments.find(app => app.id === e.target.value);
          setSelectedAppointment(appointment);
        }}
        className="w-full p-3 border rounded-lg my-4"
      >
        <option value="">Select Appointment</option>
        {appointments.map((appointment) => (
          <option key={appointment.id} value={appointment.id}>
            {appointment.customer_name} - {appointment.service?.name || "Service"} - {appointment.date}
          </option>
        ))}
      </select>

      <button onClick={generatePDF} disabled={!selectedAppointment} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Download PDF
      </button>
    </div>
  );
};

export default InvoiceGenerator;
