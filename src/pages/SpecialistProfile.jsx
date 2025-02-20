import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Get specialist ID from URL
import ServiceCard from "../components/ServiceCard";
import Calendar from "../components/Calendar";

const SpecialistProfile = () => {
  const { id } = useParams(); // Extract specialist ID from URL
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`https://backend-es6y.onrender.com/specialists/${id}`);
        if (!response.ok) throw new Error("Failed to fetch specialist");
        const data = await response.json();
        setSpecialist(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialist();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="relative bg-gray-50 font-montserrat">
      <div className="h-[300px] w-full relative">
        <img
          src={specialist.profile_pic || "/default-cover.jpg"}
          alt="Specialist cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white shadow-lg rounded-lg -mt-20 relative z-10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={specialist.profile_pic || "/default-avatar.jpg"}
              alt={specialist.users.full_name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">
                {specialist.users.full_name}
              </h1>
              <p className="text-xl text-gray-600">{specialist.speciality}</p>

              <div className="mt-4 flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt mr-2"></i> Location Not Set
              </div>
              <div className="mt-4 flex items-center text-gray-600">
                <i className="fas fa-money-bill-wave mr-2"></i>
                {specialist.service_rates || "Rates not available"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600">Bio not available</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Placeholder services */}
                <ServiceCard
                  service={{
                    name: "General Consultation",
                    duration: 30,
                    price: 100,
                    description: "Basic medical consultation.",
                  }}
                  onSelect={() => {}}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Calendar
                availableSlots={[]} // Replace with real slots later
                bookedSlots={[]}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />

              <div className="mt-6 space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold">
                  Book Appointment
                </button>

                <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center">
                  <i className="fas fa-comments mr-2"></i>
                  Chat with {specialist.users.full_name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistProfile;
