import { useState } from "react";
import { Link } from "react-router-dom";

const SpecialistDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul>
          <li>
          <Link to="/specialist-profile" className="block w-full text-left p-2 rounded hover:bg-gray-200">
              Profile
            </Link>
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
            <p>No user data available.</p>
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
