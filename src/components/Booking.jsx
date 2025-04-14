import { useState, useEffect } from "react";

const Booking = () => {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Fetch services from backend API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://backend-es6y.onrender.com/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleBooking = async () => {
    if (!serviceId || !date || !time) {
      alert("Please select a service, date, and time");
      return;
    }

    try {
      const response = await fetch("https://backend-es6y.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service_id: serviceId, date, time, status: "booked" }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      alert("Booking confirmed!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Try again later.");
    }
  };

  return (
    <div>
      <h1>Book an Appointment</h1>
      <input type="date" onChange={(e) => setDate(e.target.value)} required />
      <input type="time" onChange={(e) => setTime(e.target.value)} required />

      <select onChange={(e) => setServiceId(e.target.value)} required>
        <option value="">Select Service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
};

export default Booking;
