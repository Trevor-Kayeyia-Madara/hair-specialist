import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const BookingForm = () => {
  const { specialistId } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [specialist, setSpecialist] = useState(null);
  const [services, setServices] = useState([]);
  const [customer, setCustomer] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [appointment, setAppointment] = useState(null);

  // Fetch user (customer) data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setMessage({ text: "You must be logged in to book an appointment", type: "error" });
          return;
        }

        const response = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Session expired or invalid");
        
        const data = await response.json();
        if (data.user && data.user.full_name) {
          setCustomer(data.user.full_name);
        } else {
          setMessage({ text: "Could not retrieve user information", type: "error" });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setMessage({ text: error.message || "Error loading user data", type: "error" });
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch specialist and their services
  useEffect(() => {
    const fetchSpecialistData = async () => {
      setFetchingData(true);
      try {
        // Fetch specialist details
        const specialistResponse = await fetch(`https://backend-es6y.onrender.com/api/specialists/${specialistId}`);
        if (!specialistResponse.ok) throw new Error("Specialist not found");
        const specialistData = await specialistResponse.json();
        setSpecialist(specialistData);
        
        // Fetch services offered by this specialist
        const servicesResponse = await fetch(`https://backend-es6y.onrender.com/api/specialists/${specialistId}/services`);
        if (!servicesResponse.ok) throw new Error("Could not load services");
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching specialist data:", error);
        setMessage({ text: error.message || "Error loading specialist data", type: "error" });
      } finally {
        setFetchingData(false);
      }
    };

    if (specialistId) {
      fetchSpecialistData();
    }
  }, [specialistId]);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("You must be logged in to book an appointment");
      }

      // Prepare appointment data
      const appointmentData = {
        customer_name: customer,         // This matches the API's expected fields
        specialist_id: parseInt(specialistId, 10),
        service_id: parseInt(selectedService, 10),
        date: date,
        time: time,
      };

      // Submit booking request
      const response = await fetch("https://backend-es6y.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      // Success! Update status and show confirmation
      setAppointment({
        ...data.appointment,
        status: "Booked",
        specialist_name: specialist.full_name,
        service_name: services.find(s => s.id === parseInt(selectedService, 10))?.name || "Selected Service"
      });
      
      setMessage({ text: "Appointment booked successfully!", type: "success" });
    } catch (error) {
      console.error("Booking error:", error);
      setMessage({ text: error.message || "Error booking appointment", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Generate and download PDF invoice
  const downloadInvoice = () => {
    if (!appointment) return;
    
    const doc = new jsPDF();
    const serviceName = services.find(s => s.id === parseInt(selectedService, 10))?.name || "Selected Service";
    
    // Add logo/header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 255);
    doc.text("Appointment Confirmation", 105, 20, { align: "center" });
    
    // Add content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Booking Details", 20, 40);
    doc.line(20, 42, 190, 42);
    
    doc.setFontSize(10);
    doc.text(`Booking Reference: #${appointment.id}`, 20, 55);
    doc.text(`Status: ${appointment.status}`, 20, 65);
    doc.text(`Customer: ${customer}`, 20, 75);
    doc.text(`Specialist: ${specialist.full_name}`, 20, 85);
    doc.text(`Service: ${serviceName}`, 20, 95);
    doc.text(`Date: ${new Date(date).toLocaleDateString()}`, 20, 105);
    doc.text(`Time: ${time}`, 20, 115);
    
    // Add footer
    doc.setFontSize(8);
    doc.text("Thank you for your booking! Please arrive 10 minutes before your appointment time.", 105, 270, { align: "center" });
    
    // Save the PDF
    doc.save(`appointment_${appointment.id}.pdf`);
  };

  // Show confirmation screen after successful booking
  if (appointment) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 mt-10">
        <div className="text-center">
          <div className="mb-4 text-green-500 text-5xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-gray-700 mb-2">Appointment Details:</h3>
            <p className="text-sm text-gray-600">Specialist: <span className="font-medium">{specialist.full_name}</span></p>
            <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date(date).toLocaleDateString()}</span></p>
            <p className="text-sm text-gray-600">Time: <span className="font-medium">{time}</span></p>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={downloadInvoice}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
            >
              Download Confirmation
            </button>
            <button 
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (fetchingData) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading booking form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message.text}
        </div>
      )}
      
      {specialist && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Specialist Details:</h3>
          <p className="text-sm text-gray-600">Name: {specialist.full_name}</p>
          <p className="text-sm text-gray-600">Speciality: {specialist.speciality}</p>
          <p className="text-sm text-gray-600">Location: {specialist.location}</p>
          <p className="text-sm text-gray-600">Rating: {specialist.rating}/5</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="customer"
            value={customer}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none"
          />
        </div>
        
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Select Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {specialist && (
            <p className="mt-1 text-sm text-gray-500">
              Available between {specialist.opening_time || '08:00'} and {specialist.closing_time || '18:00'}
            </p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;