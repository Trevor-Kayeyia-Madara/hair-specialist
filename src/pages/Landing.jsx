import { useState, useEffect } from "react";
import SpecialistCard from "../components/SpecialistCard";
import ReviewsCard from "../components/ReviewsCard"; // ✅ Import ReviewsCard
import Navbar from "../components/Navbar";
import ReactPaginate from "react-paginate";
import React from "react";
import { API_BASE_URL } from "../components/ChatComponent";

const clientId = Number(localStorage.getItem("userId"));

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [reviews, setReviews] = useState([]); // ✅ State for reviews
  const [currentPage, setCurrentPage] = useState(0);
  const specialistsPerPage = 4;

  // ✅ Define chats state
  const [chats, setChats] = useState([]);

  // ✅ Define handleSelectChat
  const handleSelectChat = (chat) => {
    console.log("Selected chat:", chat);
    // You can navigate to a chat page or update the UI accordingly
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoggedIn(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backend-es6y.onrender.com/api/validate-session",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
        const response = await fetch(
          `https://backend-es6y.onrender.com/api/specialists?search=${searchQuery}`
        );
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
  }, [searchQuery]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://backend-es6y.onrender.com/api/reviews"
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const pageCount = Math.ceil(specialists.length / specialistsPerPage);
  const offset = currentPage * specialistsPerPage;
  const currentSpecialists = specialists.slice(
    offset,
    offset + specialistsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ✅ Function to start a new chat
  const startNewChat = async (specialistId) => {
    const clientId = Number(localStorage.getItem("userId")); // Get client ID from localStorage

    if (!specialistId || !clientId) {
        console.error("Specialist ID or Client ID missing");
        return;
    }

    try {
        // Make API call to create or fetch chat
        const response = await fetch("https://backend-es6y.onrender.com/api/chats/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: clientId, specialist_id: specialistId }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Chat creation failed:", data.error);
            return;
        }

        console.log("Chat created/fetched successfully:", data);

        // Update chat list with the latest chats
        setChats(data.chats);

        // Select the newly created or existing chat
        handleSelectChat(data.chats.find(chat => chat.chat_id === data.chat_id));

    } catch (error) {
        console.error("Error starting new chat:", error);
    }
};


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
          <h2 className="text-2xl md:text-3xl font-playfair text-center mb-8 md:mb-12">
            Featured Specialists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentSpecialists.length > 0 ? (
              currentSpecialists.map((specialist, index) => (
                <SpecialistCard
                  key={index}
                  specialist={specialist}
                  startNewChat={startNewChat}
                />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No specialists found.
              </p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName="flex space-x-2"
              activeClassName="bg-blue-500 text-white px-3 py-1 rounded"
              pageClassName="px-3 py-1 border rounded"
              previousClassName="px-3 py-1 border rounded"
              nextClassName="px-3 py-1 border rounded"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
