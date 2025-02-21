import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SpecialistDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get specialist ID from URL

  // Fetch specialist profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backend-es6y.onrender.com/api/specialists/${id}`);
      setProfile(response.data);
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6">
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
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-700 text-lg">👤</span>
                </div>

                <h3 className="text-lg font-semibold">{profile.full_name}</h3>
                <p className="text-gray-600">{profile.email}</p>

                {/* Profile Details */}
                <div className="mt-4 w-full border-t pt-4 text-sm text-gray-700">
                  <p><strong>Speciality:</strong> {profile.speciality}</p>
                  <p><strong>Service Rates:</strong> {profile.service_rates}</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p><strong>Joined:</strong> {new Date(profile.user_created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-center">No user data available.</p>
            )}
          </div>
        )}

        {selectedTab === "appointments" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Appointments</h2>
            <p className="text-center">No upcoming appointments.</p>
          </div>
        )}

        {selectedTab === "messages" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Messages</h2>
            <p className="text-center">No messages yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpecialistDashboard;
