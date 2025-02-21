import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import Calendar from "../components/Calendar";

const BookingFlow = () => {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [services, setServices] = useState([]);
  const [booking, setBooking] = useState({
    service: null,
    date: null,
  });

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

  const handleDateSelect = (date) => {
    setBooking({ ...booking, date });
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
                    availableDates={[new Date(2025, 2, 15), new Date(2025, 4, 20), new Date(2025, 6, 10)]}
                    selectedDate={booking.date}
                    onDateSelect={handleDateSelect}
          />

        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
