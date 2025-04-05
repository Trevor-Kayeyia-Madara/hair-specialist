import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3; // Set number of reviews per page

  // Fetch reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://your-api.com/api/reviews");
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

  const pageCount = Math.ceil(reviews.length / reviewsPerPage);
  const offset = currentPage * reviewsPerPage;
  const currentReviews = reviews.slice(offset, offset + reviewsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="font-semibold">{review.author}</p>
              <p className="text-gray-600 mt-2">{review.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No reviews found.
          </p>
        )}
      </div>

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
