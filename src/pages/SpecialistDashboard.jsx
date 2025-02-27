import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SpecialistDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
const [appointmentsLoading, setAppointmentsLoading] = useState(false);
const [appointmentsError, setAppointmentsError] = useState(null);
  const [updatedProfileData, setUpdatedProfileData] = useState({
    full_name: "",
    speciality: "",
    service_rates: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch specialist profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend-es6y.onrender.com/api/specialists/${id}`
      );
      setProfile(response.data);
      setUpdatedProfileData({
        full_name: response.data.full_name || "",
        speciality: response.data.speciality || "",
        service_rates: response.data.service_rates || "",
        location: response.data.location || "",
      });
      setError(null);
    } catch {
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (selectedTab === "profile") {
      fetchProfile();
    }
  }, [selectedTab, fetchProfile]);

  // Update profile handler
  const updateProfile = async (updatedProfile) => {
    setLoading(true);
    try {
      await axios.patch(
        `https://backend-es6y.onrender.com/api/specialists/${id}`,
        updatedProfile
      );
      fetchProfile();
      setError(null);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    updateProfile(updatedProfileData);
  };
    // Fetch appointments for the specialist
const fetchAppointments = useCallback(async () => {
  setAppointmentsLoading(true);
  try {
    const response = await axios.get(
      `https://backend-es6y.onrender.com/api/appointments/specialist/${id}`
    );
    setAppointments(response.data);
    setAppointmentsError(null);
  } catch {
    setAppointmentsError("Failed to fetch appointments.");
  } finally {
    setAppointmentsLoading(false);
  }
}, [id]);

useEffect(() => {
  if (selectedTab === "appointments") {
    fetchAppointments();
  }
}, [selectedTab, fetchAppointments]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between h-screen">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul>
            {["profile", "appointments", "messages"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setSelectedTab(tab)}
                  className={`block w-full text-left p-3 rounded-lg font-semibold ${
                    selectedTab === tab
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {selectedTab === "profile" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              Specialist Profile
            </h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : profile ? (
              <div className="flex flex-col items-center">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-700 text-lg">👤</span>
                </div>
                <h3 className="text-lg font-semibold">{profile.full_name}</h3>
                <p className="text-gray-600">{profile.email}</p>
                <div className="mt-4 w-full border-t pt-4 text-sm text-gray-700">
                  <p>
                    <strong>Speciality:</strong> {profile.speciality}
                  </p>
                  <p>
                    <strong>Service Rates:</strong> {profile.service_rates}
                  </p>
                  <p>
                    <strong>Location:</strong> {profile.location}
                  </p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(profile.user_created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Update Profile Form */}
                <form onSubmit={handleUpdateSubmit} className="mt-4 w-full">
    <input
        type="text"
        placeholder="Full Name"
        value={updatedProfileData.full_name || ""}
        onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, full_name: e.target.value })}
        className="w-full p-2 border rounded mb-2"
        required
    />
    <input
        type="text"
        placeholder="Speciality"
        value={updatedProfileData.speciality || ""}
        onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, speciality: e.target.value })}
        className="w-full p-2 border rounded mb-2"
        required
    />
    <input
        type="text"
        placeholder="Service Rates"
        value={updatedProfileData.service_rates || ""}
        onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, service_rates: e.target.value })}
        className="w-full p-2 border rounded mb-2"
    />
    <input
        type="text"
        placeholder="Location"
        value={updatedProfileData.location || ""}
        onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, location: e.target.value })}
        className="w-full p-2 border rounded mb-2"
    />
    <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Update Profile
    </button>
</form>
              </div>
            ) : (
              <p className="text-center">No user data available.</p>
            )}
          </div>
        )}
        {selectedTab === "appointments" && (
  <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">📅 Your Appointments</h2>

    {appointmentsLoading ? (
      <p className="text-center text-gray-500">Loading...</p>
    ) : appointmentsError ? (
      <p className="text-center text-red-500">{appointmentsError}</p>
    ) : appointments.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-gray-50 p-4 rounded-lg shadow-md border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Client: {appointment.customer_name}
            </h3>
            <p className="text-gray-600"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Time:</strong> {appointment.time}</p>
            <p className="text-gray-600"><strong>Status:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm 
                ${appointment.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"}`}>
                {appointment.status}
              </span>
            </p>

            {/* Chat Button using Link */}
            <Link
              to={`/chat/${appointment.customerId}`} // Ensure correct property name
              state={{ customerId: appointment.customer_id }}
              className="mt-4 block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              💬 Chat with {appointment.customer_name}
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600">No upcoming appointments.</p>
    )}
  </div>
)}
      </main>
    </div>
  );
};

export default SpecialistDashboard;
