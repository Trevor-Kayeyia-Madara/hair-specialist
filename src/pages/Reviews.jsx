import { useState, useEffect } from "react";
import ReviewsCard from "../components/ReviewsCard"; // Assuming the ReviewsCard component is in the same directory

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state
  
    // Fetch reviews from the backend API
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch("https://backend-es6y.onrender.com/api/reviews");
          
          if (response.ok) {
            const data = await response.json();
            setReviews(data);
          } else {
            console.error("Failed to fetch reviews");
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        } finally {
          setLoading(false); // Stop loading after fetching
        }
      };
  
      fetchReviews();
    }, []); // Run once when the component is mounted
  
    return (
      <div className="reviews-page-container py-10 px-6">
        <h1 className="text-2xl font-semibold text-center mb-8">Customer Reviews</h1>
        
        {loading ? (
          <div className="text-center text-lg">Loading reviews...</div> // Display loading state
        ) : reviews.length === 0 ? (
          <p className="text-center">No reviews available.</p> // If no reviews, show message
        ) : (
          <div className="reviews-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewsCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default ReviewsPage;