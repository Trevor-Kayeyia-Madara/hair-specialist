import { useState, useEffect } from "react";
import ReviewsCard from "../components/ReviewsCard"; // Assuming the ReviewsCard component is in the same directory

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from the backend
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
      }
    };

    fetchReviews();
  }, []); // Run once when the component is mounted

  return (
    <div className="reviews-page-container py-10 px-6">
      <h1 className="text-2xl font-semibold text-center mb-8">Customer Reviews</h1>
      <div className="reviews-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewsCard key={review.id} review={review} />
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
