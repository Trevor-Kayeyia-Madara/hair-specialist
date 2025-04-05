import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SpecialistChat from "../components/SpecialistChat";

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

  // ✅ State to store profile updates
  const [updatedProfileData, setUpdatedProfileData] = useState({
    full_name: "",
    speciality: "",
    service_rates: "",
    location: "",
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend-es6y.onrender.com/api/specialists/user/${id}`
      );
      setProfile(response.data);
      setUpdatedProfileData(response.data);
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

  // ✅ Update profile field (now using PUT)
const updateProfileField = async (field, value) => {
  setLoading(true);
  try {
    // Prepare the updated data structure
    const updatedData = { ...updatedProfileData, [field]: value };

    // Send a PUT request with the full updated profile data
    await axios.put(`https://backend-es6y.onrender.com/api/specialists/user/${id}`, updatedData);

    // Update the state with the new value
    setUpdatedProfileData(updatedData);
    setEditingField(null);
  } catch {
    setError(`Failed to update ${field}.`);
  } finally {
    setLoading(false);
  }
};


  const handleEditClick = (field) => {
    setEditingField(field);
    setFieldValue(updatedProfileData[field]);
  };

  const handleUpdateSubmit = () => {
    updateProfileField(editingField, fieldValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  const fetchAppointments = useCallback(async () => {
    setAppointmentsLoading(true);
  
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        console.warn("No token found, redirecting to login...");
        navigate("/login"); // 🔄 redirect to login
        return;
      }
  
      console.log("Auth token:", token); // ✅ For debugging
      console.log("Fetching appointments for user:", id);
  
      const response = await axios.get(
        `https://backend-es6y.onrender.com/api/appointments/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token
          },
        }
      );
  
      console.log("Fetched appointments:", response.data);
      setAppointments(response.data);
      setAppointmentsError(null);
  
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Failed to fetch appointments.";
      console.error("Error fetching appointments:", errMsg);
      setAppointmentsError(errMsg);
    } finally {
      setAppointmentsLoading(false);
    }
  }, [id, navigate]);
  

useEffect(() => {
    if (selectedTab === "appointments") {
        fetchAppointments();
    }
}, [selectedTab, fetchAppointments]);

  useEffect(() => {
    if (selectedTab === "appointments") {
      fetchAppointments();
    }
  }, [selectedTab, fetchAppointments]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between h-screen">
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul>
            {["profile", "appointments", "messages"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setSelectedTab(tab)}
                  className={`block w-full text-left p-3 rounded-lg font-semibold ${
                    selectedTab === tab ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-4 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ">
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
                <h3 className="text-lg font-semibold">{updatedProfileData.full_name}</h3>
                <p className="text-gray-600">{updatedProfileData.email}</p>

                <div className="mt-4 w-full border-t pt-4 text-sm text-gray-700">
                  {["full_name", "speciality", "service_rates", "location"].map((field) => (
                    <div key={field} className="mb-2 flex justify-between items-center">
                      <p>
                        <strong>{field.replace("_", " ").toUpperCase()}:</strong>{" "}
                        {editingField === field ? (
                          <input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            className="border p-1 rounded"
                          />
                        ) : (
                          updatedProfileData[field]
                        )}
                      </p>
                      {editingField === field ? (
                        <button onClick={handleUpdateSubmit} className="text-blue-500 ml-2">
                          ✅ Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(field)}
                          className="text-blue-500"
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center">No user data available.</p>
            )}
          </div>
        )}

        {/* ✅ Styled Appointments as Cards */}
        {selectedTab === "appointments" && (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">📅 Your Appointments</h2>
            {appointmentsLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : appointmentsError ? (
              <p className="text-center text-red-500">{appointmentsError}</p>
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white p-5 rounded-lg shadow-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {appointment.customer_name}
                    </h3>
                    <p className="text-gray-600"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                    <p className="text-gray-600"><strong>Time:</strong> {appointment.time}</p>
                    <p className="text-gray-600"><strong>Status:</strong> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${appointment.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"}`}>
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No upcoming appointments.</p>
            )}
          </div>
        )}
        {selectedTab === 'messages'&&(
          <SpecialistChat/>
        )}
      </main>
    </div>
  );
};

export default SpecialistDashboard;
