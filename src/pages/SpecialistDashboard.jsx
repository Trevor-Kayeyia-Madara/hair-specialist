import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SpecialistDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
const [appointmentsLoading, setAppointmentsLoading] = useState(false);
const [appointmentsError, setAppointmentsError] = useState(null);
const [editingField, setEditingField] = useState(null);
const [fieldValue, setFieldValue] = useState("");
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

   // Update specific field
   const updateProfileField = async (field, value) => {
    setLoading(true);
    try {
      await axios.patch(`https://backend-es6y.onrender.com/api/specialists/${id}`, {
        [field]: value,
      });
      fetchProfile();
      setEditingField(null);
    } catch {
      setError(`Failed to update ${field}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setFieldValue(currentValue);
  };

  const handleUpdateSubmit = () => {
    updateProfileField(editingField, fieldValue);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
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
            <h2 className="text-xl font-bold mb-4 text-center">Specialist Profile</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : profile ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-700 text-lg">👤</span>
                </div>
                <h3 className="text-lg font-semibold">{profile.full_name}</h3>
                <p className="text-gray-600">{profile.email}</p>

                <div className="mt-4 w-full border-t pt-4 text-sm text-gray-700">
                  {/* Full Name */}
                  <div className="mb-2 flex justify-between items-center">
                    <p>
                      <strong>Full Name:</strong>{" "}
                      {editingField === "full_name" ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) => setFieldValue(e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        profile.full_name
                      )}
                    </p>
                    {editingField === "full_name" ? (
                      <button onClick={handleUpdateSubmit} className="text-blue-500 ml-2">
                        ✅ Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick("full_name", profile.full_name)}
                        className="text-blue-500"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>

                  {/* Speciality */}
                  <div className="mb-2 flex justify-between items-center">
                    <p>
                      <strong>Speciality:</strong>{" "}
                      {editingField === "speciality" ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) => setFieldValue(e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        profile.speciality
                      )}
                    </p>
                    {editingField === "speciality" ? (
                      <button onClick={handleUpdateSubmit} className="text-blue-500 ml-2">
                        ✅ Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick("speciality", profile.speciality)}
                        className="text-blue-500"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>

                  {/* Service Rates */}
                  <div className="mb-2 flex justify-between items-center">
                    <p>
                      <strong>Service Rates:</strong>{" "}
                      {editingField === "service_rates" ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) => setFieldValue(e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        profile.service_rates
                      )}
                    </p>
                    {editingField === "service_rates" ? (
                      <button onClick={handleUpdateSubmit} className="text-blue-500 ml-2">
                        ✅ Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick("service_rates", profile.service_rates)}
                        className="text-blue-500"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>

                  {/* Location */}
                  <div className="mb-2 flex justify-between items-center">
                    <p>
                      <strong>Location:</strong>{" "}
                      {editingField === "location" ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) => setFieldValue(e.target.value)}
                          className="border p-1 rounded"
                        />
                      ) : (
                        profile.location
                      )}
                    </p>
                    {editingField === "location" ? (
                      <button onClick={handleUpdateSubmit} className="text-blue-500 ml-2">
                        ✅ Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick("location", profile.location)}
                        className="text-blue-500"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                </div>
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
