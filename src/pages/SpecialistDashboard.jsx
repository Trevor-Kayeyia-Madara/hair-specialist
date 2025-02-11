/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import {useState} from 'react'

const SpecialistDashboard = () => {
    const [selectedTab, setSelectedTab] = useState("services");
    const [services, setServices] = useState([
      { id: 1, name: "Hair Cut", duration: "30", price: "30" },
      { id: 2, name: "Hair Coloring", duration: "120", price: "120" },
    ]);
    const [appointments, setAppointments] = useState([
      {
        id: 1,
        service: "Hair Cut",
        client: "Jane Doe",
        date: "2025-02-20",
        time: "10:00",
      },
      {
        id: 2,
        service: "Hair Coloring",
        client: "John Smith",
        date: "2025-02-21",
        time: "14:00",
      },
    ]);
    const [messages, setMessages] = useState([
      {
        id: 1,
        client: "Jane Doe",
        message: "Looking forward to my appointment!",
        time: "10:30",
      },
      {
        id: 2,
        client: "John Smith",
        message: "Can I reschedule?",
        time: "11:45",
      },
    ]);
  return (
    <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-crimson-text text-[#333]">
            Specialist Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Sarah</span>
            <i className="fas fa-user-circle text-2xl text-gray-600"></i>
          </div>
        </div>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-crimson-text mb-2">
              Today's Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <i className="fas fa-calendar-check text-blue-500 text-xl mb-2"></i>
                <p className="text-2xl font-bold text-blue-500">8</p>
                <p className="text-sm text-gray-600">Appointments</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <i className="fas fa-dollar-sign text-green-500 text-xl mb-2"></i>
                <p className="text-2xl font-bold text-green-500">$480</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab("services")}
                  className={`px-6 py-3 ${selectedTab === "services" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
                >
                  Services
                </button>
                <button
                  onClick={() => setSelectedTab("schedule")}
                  className={`px-6 py-3 ${selectedTab === "schedule" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setSelectedTab("messages")}
                  className={`px-6 py-3 ${selectedTab === "messages" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
                >
                  Messages
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedTab === "services" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-crimson-text">My Services</h3>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      <i className="fas fa-plus mr-2"></i>Add Service
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3">Service</th>
                          <th className="text-left p-3">Duration (min)</th>
                          <th className="text-left p-3">Price ($)</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service) => (
                          <tr key={service.id} className="border-t">
                            <td className="p-3">{service.name}</td>
                            <td className="p-3">{service.duration}</td>
                            <td className="p-3">${service.price}</td>
                            <td className="p-3">
                              <button className="text-blue-500 hover:text-blue-700 mr-2">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="text-red-500 hover:text-red-700">
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedTab === "schedule" && (
                <div>
                  <h3 className="text-lg font-crimson-text mb-4">
                    Upcoming Appointments
                  </h3>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded"
                      >
                        <div>
                          <p className="font-medium">{appointment.client}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.service}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.time}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <i className="fas fa-check-circle"></i>
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <i className="fas fa-times-circle"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === "messages" && (
                <div>
                  <h3 className="text-lg font-crimson-text mb-4">
                    Client Messages
                  </h3>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start space-x-4 bg-gray-50 p-4 rounded"
                      >
                        <i className="fas fa-user-circle text-3xl text-gray-400 mt-1"></i>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium">{message.client}</p>
                            <span className="text-sm text-gray-500">
                              {message.time}
                            </span>
                          </div>
                          <p className="text-gray-600">{message.message}</p>
                        </div>
                        <button className="text-blue-500 hover:text-blue-700">
                          <i className="fas fa-reply"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SpecialistDashboard