/* eslint-disable react-hooks/exhaustive-deps */
import {useState,useEffect} from 'react'

const Search = () => {
    const [location, setLocation] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [rating, setRating] = useState("");
    const [results, setResults] = useState([]);

    const specialist = [
        {
          id: 1,
          name: "Dr. Sarah Smith",
          specialty: "Cardiology",
          location: "New York",
          rating: 4.8,
          image: "/doctor1.jpg",
        },
        {
          id: 2,
          name: "Dr. John Davis",
          specialty: "Pediatrics",
          location: "Los Angeles",
          rating: 4.5,
          image: "/doctor2.jpg",
        },
        {
          id: 3,
          name: "Dr. Emily Wilson",
          specialty: "Dermatology",
          location: "Chicago",
          rating: 4.9,
          image: "/doctor3.jpg",
        },
        {
          id: 4,
          name: "Dr. Michael Chen",
          specialty: "Orthopedics",
          location: "Boston",
          rating: 4.7,
          image: "/doctor4.jpg",
        },
      ];
    
      const specialties = [
        "Cardiology",
        "Pediatrics",
        "Dermatology",
        "Orthopedics",
      ];
      const locations = ["New York", "Los Angeles", "Chicago", "Boston"];
      const ratings = ["4.5+", "4.0+", "3.5+", "3.0+"];
    
      useEffect(() => {
        let filtered = [...specialist];
    
        if (location) {
          filtered = filtered.filter((doctor) => doctor.location === location);
        }
        if (specialty) {
          filtered = filtered.filter((doctor) => doctor.specialty === specialty);
        }
        if (rating) {
          const minRating = parseFloat(rating.replace("+", ""));
          filtered = filtered.filter((doctor) => doctor.rating >= minRating);
        }
    
        setResults(filtered);
      }, [location, specialty, rating, specialist]);
    
      return (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 font-roboto">
              Find a Doctor
            </h1>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <select
                className="p-3 border rounded-lg bg-white shadow-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                name="location"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
    
              <select
                className="p-3 border rounded-lg bg-white shadow-sm"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                name="specialty"
              >
                <option value="">Select Specialty</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
    
              <select
                className="p-3 border rounded-lg bg-white shadow-sm"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                name="rating"
              >
                <option value="">Select Rating</option>
                {ratings.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={doctor.image}
                    alt={`Portrait of ${doctor.name}`}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold font-roboto mb-2">
                      {doctor.name}
                    </h2>
                    <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                    <p className="text-gray-600 mb-2">{doctor.location}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">
                        <i className="fas fa-star"></i>
                      </span>
                      <span>{doctor.rating}</span>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
    
            {results.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                No doctors found matching your criteria. Try adjusting your filters.
              </div>
            )}
          </div>
        </div>
  )
}

export default Search