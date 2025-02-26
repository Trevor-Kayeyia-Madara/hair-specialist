import { useState, useEffect } from 'react';
import SpecialistCard from '../components/SpecialistCard';
import ReviewCard from '../components/ReviewCard';
import Navbar from '../components/Navbar';

const Landing = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [specialists, setSpecialists] = useState([]);

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
                    setUserProfile(data.user);
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

    useEffect(() => {
        const fetchSpecialists = async () => {
            try {
                const response = await fetch(`https://backend-es6y.onrender.com/api/specialists?search=${searchQuery}`);
                if (response.ok) {
                    const data = await response.json();
                    setSpecialists(data);
                } else {
                    console.error("Failed to fetch specialists");
                }
            } catch (error) {
                console.error("Error fetching specialists:", error);
            }
        };
    
        fetchSpecialists();
    }, [searchQuery]); // Trigger when searchQuery changes
    
  
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isLoggedIn={loggedIn} userProfile={userProfile} />

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center px-4 py-12 md:py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center font-montserrat mb-4">
                    Find Your Perfect Hair Specialist
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-center font-roboto mb-8 text-blue-100">
                    Book appointments with top hair specialists in your area
                </p>
                <div className="w-full max-w-2xl">
                    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-2">
                        <input
                            type="text"
                            placeholder="Enter your location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow px-4 py-3 text-gray-700 focus:outline-none font-roboto mb-2 md:mb-0"
                            name="location"
                        />
                    </div>
                </div>
            </div>

            {/* Featured Specialists Section */}
            <section className="py-12 md:py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8 md:mb-12">Featured Specialists</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specialists.length > 0 ? (
                            specialists.map((specialist, index) => (
                                <SpecialistCard key={index} specialist={specialist} />
                            ))
                        ) : (
                            <p className="text-center text-gray-600 col-span-full">No specialists found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 md:py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8 md:mb-16">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {["Search", "Book", "Enjoy"].map((step, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-xl font-semibold mb-4">{step}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="py-12 md:py-20 px-4 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8 md:mb-12">Customer Reviews</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                user: { name: "Sarah Thompson", avatar: "/avatar1.jpg" },
                                rating: 5,
                                date: "2025-01-15",
                                text: "Found my perfect hairstylist through this platform! The booking process was seamless and the results were amazing.",
                            },
                            {
                                user: { name: "Michael Chen", avatar: "/avatar2.jpg" },
                                rating: 5,
                                date: "2025-01-10",
                                text: "Great experience from start to finish. My stylist understood exactly what I wanted and delivered beyond expectations.",
                            },
                        ].map((review, index) => (
                            <ReviewCard key={index} review={review} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
