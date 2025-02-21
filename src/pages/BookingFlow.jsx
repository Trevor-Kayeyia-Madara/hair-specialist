import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import Calendar from "../components/Calendar";

const BookingFlow = () => {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [booking, setBooking] = useState({
    service: null,
    date: null,
  });

  useEffect(() => {
    // Fetch specialist details (Replace with actual API call)
    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
        const data = await response.json();
        setSpecialist(data);
      } catch (error) {
        console.error("Error fetching specialist:", error);
      }
    };

    fetchSpecialist();
  }, [id]);

  const services = [
    {
      name: "Haircut & Style",
      duration: 60,
      price: 85.0,
      description:
        "Professional haircut and styling tailored to your preferences",
    },
    {
      name: "Color & Highlights",
      duration: 120,
      price: 150.0,
      description: "Full color or highlights to transform your look",
    },
    {
      name: "Balayage",
      duration: 180,
      price: 200.0,
      description: "Hand-painted highlights for a natural, graduated color",
    },
  ];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Select a Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                onSelect={handleServiceSelect}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Choose a Date
          </h2>
          <Calendar
            availableSlots={[new Date()]}
            selectedSlot={booking.date}
            onSelectSlot={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
