import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const InvoiceGenerator = () => {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);
  
    useEffect(() => {
      const fetchAppointment = async () => {
        try {
          const response = await fetch(`https://backend-es6y.onrender.com/api/appointments/${appointmentId}`);
          const data = await response.json();
          setAppointment(data);
        } catch (error) {
          console.error("Error fetching appointment:", error);
        }
      };
      fetchAppointment();
    }, [appointmentId]);
  
    const generatePDF = () => {
      const doc = new jsPDF();
      doc.text("📜 Invoice", 90, 10);
      doc.text(`Customer: ${appointment.customer_name}`, 10, 30);
      doc.text(`Service: ${appointment.service.name}`, 10, 40);
      doc.text(`Date: ${appointment.date}`, 10, 50);
      doc.text(`Time: ${appointment.time}`, 10, 60);
      doc.text(`Amount: $${appointment.service.price}`, 10, 70);
      doc.save("invoice.pdf");
    };
  
    if (!appointment) return <p>Loading...</p>;
  return (
    <div>
      <h2>Invoice for {appointment.customer_name}</h2>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  )
}

export default InvoiceGenerator