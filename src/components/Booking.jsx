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
        alert("Error fetching services. Please try again later.");
      }
    };

    fetchServices();
  }, []);

  const handleBooking = async () => {
    console.log("handleBooking called"); // Debugging line to ensure function is triggered
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
        body: JSON.stringify({
          service_id: serviceId,
          date,
          time,
          status: "booked",
        }),
      });

      // Debugging to check response status
      console.log("Response Status:", response.status);

      if (response.status === 409) {
        alert("The selected appointment time is already taken. Please choose another time.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData?.error || "Failed to book the appointment. Please try again later.");
        return;
      }

      alert("Booking confirmed!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Something went wrong while booking. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Book an Appointment</h1>
      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        onChange={(e) => setTime(e.target.value)}
        required
      />

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
