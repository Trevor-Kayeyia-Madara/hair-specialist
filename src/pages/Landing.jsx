import {useState} from 'react'
import SpecialistCard from '../components/SpecialistCard';
import ReviewCard from '../components/ReviewCard';


const Landing = () => {
    const [email, setEmail] = useState("");

    const specialists = [
        {
          name: "Sarah Johnson",
          title: "Hair Color Specialist",
          image: "/specialist1.jpg",
          rating: 5,
          specialties: ["Balayage", "Color Correction", "Highlights"],
          location: "New York, NY",
        },
        {
          name: "Emily Chen",
          title: "Styling Expert",
          image: "/specialist2.jpg",
          rating: 4,
          specialties: ["Bridal", "Updos", "Cutting"],
          location: "Los Angeles, CA",
        },
        {
          name: "Rachel Martinez",
          title: "Texture Specialist",
          image: "/specialist3.jpg",
          rating: 5,
          specialties: ["Curly Hair", "Extensions", "Natural Hair"],
          location: "Miami, FL",
        },
      ];
    
    
      const reviews = [
        {
          user: {
            name: "Sarah Thompson",
            avatar: "/avatar1.jpg",
          },
          rating: 5,
          date: "2025-01-15",
          text: "Found my perfect hairstylist through this platform! The booking process was seamless and the results were amazing.",
        },
        {
          user: {
            name: "Michael Chen",
            avatar: "/avatar2.jpg",
          },
          rating: 5,
          date: "2025-01-10",
          text: "Great experience from start to finish. My stylist understood exactly what I wanted and delivered beyond expectations.",
        },
      ];
  return (
    <div className="font-montserrat">
    <section className="relative h-[600px] flex items-center justify-center">
      <div className="absolute inset-0">
      <img src="/assets/images/salon-hero.jpg" alt="Modern hair salon interior with elegant styling stations" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="relative text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-playfair mb-6">
          Find Your Perfect Hair Specialist
        </h1>
        <p className="text-xl mb-8">
          Book appointments with top hair specialists in your area
        </p>

        <div className="max-w-2xl mx-auto flex">
          <input
            type="text"
            placeholder="Enter your location"
            className="flex-1 px-6 py-4 rounded-l-lg text-gray-800 focus:outline-none"
          />
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-r-lg transition-colors">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>

    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-playfair text-center mb-12">
          Featured Specialists
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
        {specialists.map((specialist, index) => (
            <SpecialistCard key={index} specialist={specialist} />
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-playfair text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: "fa-search",
              title: "Search",
              description:
                "Find the perfect specialist based on your preferences",
            },
            {
              icon: "fa-calendar",
              title: "Book",
              description: "Schedule your appointment at your preferred time",
            },
            {
              icon: "fa-star",
              title: "Enjoy",
              description: "Get amazing results and share your experience",
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <i className={`fas ${step.icon} text-2xl text-blue-600`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-playfair text-center mb-12">
          What Our Users Say
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-4 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-playfair mb-6">
          Are You a Hair Specialist?
        </h2>
        <p className="text-xl mb-8">
          Join our platform and grow your business
        </p>
        <a
          href="/signup"
          className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Join as a Specialist
        </a>
      </div>
    </section>

    <section className="py-20 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-playfair mb-6">Stay Updated</h2>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter for the latest updates and offers
        </p>
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 border rounded-l-lg focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 text-white px-8 py-4 rounded-r-lg hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>

    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-playfair text-2xl mb-4">
            Hair Specialist Finder
          </h3>
          <p className="text-gray-400">
            Find and book the best hair specialists in your area
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="/search" className="text-gray-400 hover:text-white">
                Search
              </a>
            </li>
            <li>
              <a href="/booking" className="text-gray-400 hover:text-white">
                Book Now
              </a>
            </li>
            <li>
              <a
                href="/specialists"
                className="text-gray-400 hover:text-white"
              >
                Specialists
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <a href="/help" className="text-gray-400 hover:text-white">
                Help Center
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  )
}

export default Landing