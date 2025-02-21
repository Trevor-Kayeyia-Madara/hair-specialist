import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import Calendar from "../components/Calendar";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

const BookingFlow = () => {
  const { id } = useParams();
  const { data: bookedDates, loading: loadingDates } = useFetch("https://backend-es6y.onrender.com/api/booked-dates");
  const { data: specialist, loading: loadingSpecialist } = useFetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
  const { data: services, loading: loadingServices } = useFetch("https://backend-es6y.onrender.com/api/services");

  const [booking, setBooking] = useState({
    service: null,
    date: null,
  });

  const handleDateSelect = (date) => {
    setBooking((prev) => ({ ...prev, date }));
  };

  const handleServiceSelect = (service) => {
    setBooking((prev) => ({ ...prev, service }));
  };

  if (loadingDates || loadingSpecialist || loadingServices) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose a Date</h2>
          <Calendar
            availableDates={bookedDates.map((dateStr) => new Date(dateStr))}
            selectedDate={booking.date}
            onDateSelect={handleDateSelect}
          />
        </div>

        {booking.date && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
