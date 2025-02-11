import {useState} from 'react'

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState("appointments");
  const [appointments,] = useState([
    {
      id: 1,
      specialist: "Dr. Sarah Smith",
      service: "Therapy Session",
      date: "2025-03-15",
      time: "14:00",
      status: "upcoming",
    },
    {
      id: 2,
      specialist: "Dr. John Doe",
      service: "Consultation",
      date: "2025-03-10",
      time: "11:30",
      status: "completed",
    },
  ]);
  const [reviews] = useState([
    {
      id: 1,
      specialist: "Dr. Sarah Smith",
      rating: 5,
      text: "Excellent session!",
      date: "2025-03-01",
    },
    {
      id: 2,
      specialist: "Dr. John Doe",
      rating: 4,
      text: "Very helpful consultation",
      date: "2025-02-28",
    },
  ]);
  const [messages] = useState([
    {
      id: 1,
      specialist: "Dr. Sarah Smith",
      text: "Looking forward to our next session!",
      time: "09:30",
      date: "2025-03-14",
    },
    {
      id: 2,
      specialist: "Dr. John Doe",
      text: "Please confirm your appointment time",
      time: "15:45",
      date: "2025-03-13",
    },
  ]);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "appointments"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "reviews"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "messages"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Messages
            </button>
          </nav>
        </div>

        <div className="p-4">
          {activeTab === "appointments" && (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{appointment.specialist}</h3>
                    <p className="text-sm text-gray-500">
                      {appointment.service}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{review.specialist}</h3>
                      <div className="flex items-center mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <i
                            key={i}
                            className="fas fa-star text-yellow-400"
                          ></i>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.date}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{message.specialist}</h3>
                    <div className="text-sm text-gray-500">
                      <span>{message.time}</span>
                      <span className="mx-1">•</span>
                      <span>{message.date}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600">{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserDashboard