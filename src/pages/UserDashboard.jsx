import {useState, useEffect} from 'react';
import ChatWindow from '../components/ChatWindow';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    const [nextAppointment] = useState({
      date: "2025-02-15T10:00:00",
      specialist: {
        name: "Sarah Johnson",
        avatar: "/specialist1.jpg",
        id: "2",
      },
      service: "Balayage",
    });
  
    const [upcomingAppointments] = useState([
      {
        id: 1,
        date: "2025-02-15T10:00:00",
        specialist: { name: "Sarah Johnson", avatar: "/specialist1.jpg" },
        service: "Balayage",
      },
      {
        id: 2,
        date: "2025-02-20T14:30:00",
        specialist: { name: "Mike Wilson", avatar: "/specialist2.jpg" },
        service: "Haircut & Style",
      },
    ]);
  
    const [pastAppointments] = useState([
      {
        id: 3,
        date: "2025-01-10T11:00:00",
        specialist: { name: "Sarah Johnson", avatar: "/specialist1.jpg" },
        service: "Color Touch-Up",
        photos: ["/result1.jpg", "/result2.jpg"],
        reviewed: false,
      },
    ]);
  
    const [favoriteSpecialists] = useState([
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/specialist1.jpg",
        specialty: "Color Specialist",
        rating: 4.9,
      },
    ]);
  
    const tabContent = {
      upcoming: (
        <div className="grid gap-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={appointment.specialist.avatar}
                    alt={appointment.specialist.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{appointment.service}</h3>
                    <p className="text-gray-600">
                      with {appointment.specialist.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
      past: (
        <div className="grid gap-4">
          {pastAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">{appointment.service}</h3>
                  <p className="text-gray-600">
                    with {appointment.specialist.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleString()}
                  </p>
                </div>
                {!appointment.reviewed && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Leave Review
                  </button>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {appointment.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Result ${index + 1}`}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
      messages: (
        <div className="flex gap-4">
          <div className="w-1/3 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-4">Your Specialists</h3>
            <div className="space-y-4">
              {favoriteSpecialists.map((specialist) => (
                <div
                  key={specialist.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <img
                    src={specialist.avatar}
                    alt={specialist.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{specialist.name}</p>
                    <p className="text-sm text-gray-500">
                      {specialist.specialty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3">
            <ChatWindow
              messages={[]}
              onSendMessage={() => {}}
              currentUser={currentUser}
              otherUser={nextAppointment.specialist}
            />
          </div>
        </div>
      ),
      favorites: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteSpecialists.map((specialist) => (
            <div
              key={specialist.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={specialist.avatar}
                  alt={specialist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{specialist.name}</h3>
                  <p className="text-gray-600">{specialist.specialty}</p>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-star text-yellow-400"></i>
                    <span>{specialist.rating}</span>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      ),
      settings: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-6">Personal Information</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                defaultValue={currentUser.name}
                className="p-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={currentUser.email}
                className="p-2 border rounded-lg"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="p-2 border rounded-lg"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="p-2 border rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold my-4">Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="email_notifications" />
                  <span>Email Notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="sms_notifications" />
                  <span>SMS Notifications</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      ),
    };
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const authToken = localStorage.getItem("authToken"); // Retrieve stored token
          if (!authToken) {
            throw new Error("User not authenticated");
          }
  
          const response = await fetch("https://backend-es6y.onrender.com/api/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // Send token in the request
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
  
          const userData = await response.json();
          setCurrentUser(userData); // Store user details
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserDetails();
    }, []);
  
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleLogout = () => {
      // Clear authentication data (localStorage/sessionStorage)
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Redirect to login page
      window.location.href = '/login';
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
              {nextAppointment && (
                <p className="text-gray-600">
                  Your next appointment is on{" "}
                  {new Date(nextAppointment.date).toLocaleDateString()} with{" "}
                  {nextAppointment.specialist.name} for{" "}
                  {nextAppointment.service}
                </p>
              )}
            </div>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex">
              {["upcoming", "past", "messages", "favorites", "settings"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="p-6">{tabContent[activeTab]}</div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard