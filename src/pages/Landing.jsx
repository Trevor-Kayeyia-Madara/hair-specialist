import { useState, useEffect } from 'react';
import SpecialistCard from '../components/SpecialistCard';
import ReviewCard from '../components/ReviewCard';
import Navbar from '../components/Navbar';

const Landing = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoggedIn(false);
                return;
            }

            try {
                const response = await fetch("https://backend-es6y.onrender.com/api/validate-session", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setLoggedIn(true);
                    const data = await response.json();
                    setUserProfile(data.user); // Fetch user profile when logged in
                } else {
                    setLoggedIn(false);
                    setUserProfile(null);
                    localStorage.removeItem("authToken");
                }
            } catch (error) {
                console.error("Session validation error:", error);
                setLoggedIn(false);
                setUserProfile(null);
            }
        };

        checkSession();
    }, []);

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
        <div className="min-h-screen bg-gray-50">
            {/* Pass the correct prop name */}
            <Navbar isLoggedIn={loggedIn} userProfile={userProfile} />

            <div className="flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h1 className="text-4xl md:text-6xl font-bold text-center font-montserrat mb-4">
                    Find Your Perfect Hair Specialist
                </h1>
                <p className="text-xl md:text-2xl text-center font-roboto mb-8 text-blue-100">
                    Book appointments with top hair specialists in your area
                </p>
                <div className="w-full max-w-2xl">
                    <div className="flex bg-white rounded-lg shadow-lg p-2">
                        <input
                            type="text"
                            placeholder="Enter your location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow px-4 py-3 text-gray-700 focus:outline-none font-roboto"
                            name="location"
                        />
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-montserrat">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-playfair text-center mb-12">Featured Specialists</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {specialists.map((specialist, index) => (
                            <SpecialistCard key={index} specialist={specialist} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-playfair text-center mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: "fa-search",
                                title: "Search",
                                description: "Find the perfect specialist based on your preferences",
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

            <section className="py-20 px-4 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-playfair text-center mb-12">Customer Reviews</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {reviews.map((review, index) => (
                            <ReviewCard key={index} review={review} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
