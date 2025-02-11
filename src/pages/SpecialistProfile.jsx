import {useState} from 'react'
import ServiceCard from '../components/ServiceCard';
import Calendar from '../components/Calendar';

const SpecialistProfile = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const specialist = {
      name: "Dr. Sarah Johnson",
      title: "Dermatology Specialist",
      rating: 4.9,
      reviewCount: 128,
      location: "New York, NY",
      experience: 12,
      avatar: "/specialist1.jpg",
      coverPhoto: "/specialist-cover.jpg",
      specialties: [
        "Medical Dermatology",
        "Cosmetic Procedures",
        "Laser Treatment",
        "Skin Cancer Screening",
      ],
      about:
        "Dr. Johnson is a board-certified dermatologist with over 12 years of experience. She specializes in both medical and cosmetic dermatology, providing comprehensive skin care solutions. Her approach combines cutting-edge treatments with personalized care to achieve the best possible outcomes for her patients.",
    };
  
    const services = [
      {
        name: "Initial Consultation",
        duration: 30,
        price: 150,
        description:
          "Comprehensive skin assessment and personalized treatment planning.",
      },
      {
        name: "Acne Treatment",
        duration: 45,
        price: 200,
        description:
          "Advanced treatment for persistent acne including medication and care plan.",
      },
      {
        name: "Skin Cancer Screening",
        duration: 30,
        price: 175,
        description:
          "Thorough examination of skin for early detection of skin cancer.",
      },
    ];
  
    const today = new Date();
    const availableSlots = [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    ];
  
    const reviews = [
      {
        author: "Michael R.",
        rating: 5,
        date: "2 weeks ago",
        content:
          "Dr. Johnson was extremely thorough and professional. She took the time to explain everything clearly.",
        avatar: "/avatar1.jpg",
      },
      {
        author: "Emma S.",
        rating: 5,
        date: "1 month ago",
        content:
          "Outstanding experience! The treatment plan she created for my acne has shown amazing results.",
        avatar: "/avatar2.jpg",
      },
    ];
  return (
    <div className="relative bg-gray-50 font-montserrat">
      <div className="h-[300px] w-full relative">
        <img
          src={specialist.coverPhoto}
          alt="Specialist clinic interior"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white shadow-lg rounded-lg -mt-20 relative z-10 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {specialist.name}
                  </h1>
                  <p className="text-xl text-gray-600">{specialist.title}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400"></i>
                    <span className="ml-2 font-semibold">
                      {specialist.rating}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({specialist.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {specialist.location}
                </div>
                <div className="flex items-center text-gray-600 ml-4">
                  <i className="fas fa-clock mr-2"></i>
                  {specialist.experience} years experience
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {specialist.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600">{specialist.about}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    service={service}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b last:border-0 pb-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold">{review.author}</h3>
                          <span className="text-gray-500 text-sm ml-4">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Calendar
                availableSlots={availableSlots}
                bookedSlots={[]}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />

              <div className="mt-6 space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold">
                  Book Appointment
                </button>

                <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center">
                  <i className="fas fa-comments mr-2"></i>
                  Chat with Dr. Johnson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecialistProfile