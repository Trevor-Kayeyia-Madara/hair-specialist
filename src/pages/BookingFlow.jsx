import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookingFlow = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [specialist, setSpecialist] = useState(null);
  const [services, setServices] = useState([]);
  const [booking, setBooking] = useState({ service_id: "", date: "", time: "" });

  useEffect(() => {
    // Fetch user session data
    axios.get("https://backend-es6y.onrender.com/api/user-session")
      .then(res => setUser(res.data))
      .catch(err => console.error("Error fetching user session", err));

    // Fetch specialist details
    axios.get(`https://backend-es6y.onrender.com/api/specialists/${id}`)
      .then(res => setSpecialist(res.data))
      .catch(err => console.error("Error fetching specialist", err));

    // Fetch available services
    axios.get("https://backend-es6y.onrender.com/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error("Error fetching services", err));
  }, [id]);

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://backend-es6y.onrender.com/api/appointments", {
        customer_id: user.id,
        specialist_id: specialist.id,
        service_id: booking.service_id,
        date: booking.date,
        time: booking.time,
        status: "pending"
      });
      alert("Booking confirmed!");
    } catch (error) {
      console.error("Error submitting booking", error);
    }
  };

  if (!specialist || !user.full_name) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input type="text" value={user.full_name} readOnly className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={user.email} readOnly className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Specialist</label>
            <input type="text" value={specialist.full_name} readOnly className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select a Service</label>
            <select name="service_id" onChange={handleChange} required className="w-full p-2 border rounded">
              <option value="">Choose a service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Date</label>
            <input type="date" name="date" onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Time</label>
            <input type="time" name="time" onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingFlow;
