import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        console.error("Fetch error:", err);
        setError(err.message);
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
  const navigate = useNavigate();

  // Fetching necessary data
  const { data: bookedDates, loading: loadingDates, error: errorDates } = useFetch("https://backend-es6y.onrender.com/api/booked-dates");
  const { data: specialist, loading: loadingSpecialist, error: errorSpecialist } = useFetch(`https://backend-es6y.onrender.com/api/specialists/${id}`);
  const { data: services, loading: loadingServices, error: errorServices } = useFetch("https://backend-es6y.onrender.com/api/services");
  const { data: user, loading: loadingUser, error: errorUser } = useFetch("https://backend-es6y.onrender.com/api/auth/user");

  const [booking, setBooking] = useState({
    service_id: null,
    date: null,
    time: "",
  });

  const handleDateSelect = (date) => {
    setBooking((prev) => ({ ...prev, date }));
  };

  const handleServiceSelect = (service) => {
    setBooking((prev) => ({ ...prev, service_id: service.id }));
  };

  const handleTimeChange = (e) => {
    setBooking((prev) => ({ ...prev, time: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!booking.service_id || !booking.date || !booking.time) {
      alert("Please select a service, date, and time.");
      return;
    }

    try {
      const response = await axios.post("https://backend-es6y.onrender.com/api/appointments", {
        customer_id: user?.id,
        specialist_id: id,
        service_id: booking.service_id,
        date: booking.date,
        time: booking.time,
        status: "Pending",
      });

      navigate(`/payment/${response.data.id}`); // Redirect to payment page
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment.");
    }
  };

  if (loadingDates || loadingSpecialist || loadingServices || loadingUser) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (errorDates || errorSpecialist || errorServices || errorUser) {
    return <div className="text-center text-red-500">Failed to load data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-4xl mx-auto space-y-12">
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book an Appointment</h2>

          <div className="mb-4">
            <label className="block text-gray-700">Select a Date</label>
            <Calendar
              availableDates={bookedDates.map((dateStr) => new Date(dateStr))}
              selectedDate={booking.date}
              onDateSelect={handleDateSelect}
            />
          </div>

          {booking.date && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Specialist</label>
                <p className="text-lg font-semibold">{specialist.full_name}</p>
                <p className="text-gray-600">{specialist.speciality}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Select a Service</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <ServiceCard key={service.id} service={service} onSelect={handleServiceSelect} />
                    ))
                  ) : (
                    <p className="text-gray-500">No services available</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Select a Time</label>
                <input
                  type="time"
                  value={booking.time}
                  onChange={handleTimeChange}
                  className="mt-1 p-2 border w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={user?.full_name || ""}
                  readOnly
                  className="mt-1 p-2 border w-full bg-gray-100 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Proceed to Payment
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingFlow;
