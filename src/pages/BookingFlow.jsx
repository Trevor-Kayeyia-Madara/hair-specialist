import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import Calendar from "../components/Calendar";
import axios from "axios";

const BookingFlow = () => {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [services, setServices] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [booking, setBooking] = useState({
    service: null,
    date: null,
  });

   // Fetch booked dates from API
   useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get("https://backend-es6y.onrender.com/api/booked-dates");
        const bookedDates = response.data.map(dateStr => new Date(dateStr));
        setAvailableDates(bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    fetchBookedDates();
  }, []);

  // Handle date selection and make a booking
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    
    const appointmentData = {
      customer_id: 1, // Replace with actual logged-in user ID
      specialist_id: 2, // Replace with actual specialist ID
      service_id: 3, // Replace with actual service ID
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      time: "14:00:00", // Set a default time or let user select
      status: "pending",
    };

    try {
      const response = await axios.post("hhttps://backend-es6y.onrender.com/api/appointments", appointmentData);
      alert("Appointment booked successfully!");
      console.log("Appointment:", response.data);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        const data = await response.json();
        setSpecialist(data);
      } catch (error) {
        console.error("Error fetching specialist:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch("https://backend-es6y.onrender.com/api/services");
        const data = await response.json();
        setServices(data);
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
    setBooking({ ...booking, service });
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
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
