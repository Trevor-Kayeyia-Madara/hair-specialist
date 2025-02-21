import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SpecialistDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get specialist ID from URL

  // Use useCallback to memoize fetchProfile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backend-es6y.onrender.com/specialist_profile/${id}`);
      setProfile(response.data);
      setError(null);
    } catch {
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependency on `id` to refetch if it changes

  useEffect(() => {
    if (selectedTab === "profile") {
      fetchProfile();
    }
  }, [selectedTab, fetchProfile]); // Add fetchProfile to dependencies

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul>
          <li>
            <button onClick={() => setSelectedTab("profile")} className="block w-full text-left p-2 rounded hover:bg-gray-200">
              Profile
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("appointments")} className="block w-full text-left p-2 rounded hover:bg-gray-200">
              Appointments
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab("messages")} className="block w-full text-left p-2 rounded hover:bg-gray-200">
              Messages
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {selectedTab === "profile" && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : profile ? (
              <div>
                <p><strong>Name:</strong> {profile.users?.full_name}</p>
                <p><strong>Email:</strong> {profile.users?.email}</p>
                <p><strong>Speciality:</strong> {profile.speciality}</p>
                <p><strong>Service Rates:</strong> {profile.service_rates}</p>
                <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        )}

        {selectedTab === "appointments" && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Appointments</h2>
            <p>No upcoming appointments.</p>
          </div>
        )}

        {selectedTab === "messages" && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <p>No messages yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpecialistDashboard;
