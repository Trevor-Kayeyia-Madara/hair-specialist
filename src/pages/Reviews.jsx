import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const reviewsPerPage = 3; // Adjust the number of reviews per page

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
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const pageCount = Math.ceil(reviews.length / reviewsPerPage);
  const offset = currentPage * reviewsPerPage;
  const currentReviews = reviews.slice(offset, offset + reviewsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="reviews-page-container py-10 px-6">
      <h1 className="text-2xl font-semibold text-center mb-8">Customer Reviews</h1>

      {loading ? (
        <div className="text-center text-lg">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <p className="text-center">No reviews available.</p>
      ) : (
        <div className="reviews-list space-y-6">
          {currentReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">{review.specialist_name}</h3>
                <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star text-sm ${
                      index < review.rating ? "text-blue-400" : "text-gray-200"
                    }`}
                  ></i>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">{review.review}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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
  );
};

export default ReviewsPage;
