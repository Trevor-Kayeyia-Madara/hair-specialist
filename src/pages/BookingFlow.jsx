import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import Calendar from "../components/Calendar";

const BookingFlow = () => {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [services, setServices] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [booking, setBooking] = useState({
    service: null,
    date: null,
  });

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get("https://backend-es6y.onrender.com/api/booked-dates");
        
        // Convert date strings to actual Date objects
        const bookedDates = response.data.map(dateStr => new Date(dateStr));
        setAvailableDates(bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };
  
    fetchBookedDates();
  }, []);

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await axios.get(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        setSpecialist(response.data);
      } catch (error) {
        console.error("Error fetching specialist:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get("https://backend-es6y.onrender.com/api/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    if (id) {
      fetchSpecialist();
      fetchServices();
    } else {
      console.error("No ID provided for fetching specialist");
    }
  }, [id]);

  const handleServiceSelect = (service) => {
    setBooking(prev => ({ ...prev, service }));
  };

  const handleDateSelect = async (date) => {
    if (!booking.service) {
      alert("Please select a service first!");
      return;
    }

    setBooking(prev => ({ ...prev, date }));

    const appointmentData = {
      customer_id: 1, // Replace with actual logged-in user ID
      specialist_id: specialist.id,
      service_id: booking.service.id,
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      time: "14:00:00", // Default time or user selection
      status: "pending",
    };

    try {
      const response = await axios.post("https://backend-es6y.onrender.com/api/appointments", appointmentData);
      alert("Appointment booked successfully!");
      console.log("Appointment:", response.data);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  if (!specialist) {
    return <div className="text-center mt-10">Loading specialist details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Booking for {specialist.full_name}
          </h2>
          <p className="text-lg text-gray-700">{specialist.speciality}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Select a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                />
              ))
            ) : (
              <p className="text-gray-500">No services available</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose a Date</h2>
          <Calendar
            availableDates={availableDates}
            selectedDate={booking.date}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
