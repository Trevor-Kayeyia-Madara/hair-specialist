/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Reviews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId, specialistId, specialistName } = location.state || {};
    
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    useEffect(() => {
        if (!customerId || !specialistId) {
            toast.error("Invalid review request.");
            navigate("/");
        } else {
            fetchExistingReview();
        }
    }, [customerId, specialistId, navigate]);

    // ✅ Fetch existing review for editing
    const fetchExistingReview = async () => {
        try {
            const response = await fetch(`https://backend-es6y.onrender.com/api/reviews/${customerId}/${specialistId}`);
            if (!response.ok) return;
            
            const data = await response.json();
            if (data) {
                setExistingReview(data);
                setRating(data.rating);
                setReviewText(data.review_text);
            }
        } catch (error) {
            console.error("Error fetching review:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("authToken");

        try {
            const method = existingReview ? "PUT" : "POST";
            const url = "https://backend-es6y.onrender.com/api/reviews";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    customer_id: customerId,
                    specialist_id: specialistId,
                    rating,
                    review_text: reviewText
                }),
            });

            if (!response.ok) throw new Error("Failed to submit review.");
            toast.success(`✅ Review ${existingReview ? "updated" : "submitted"} successfully!`);
            navigate("/");
        } catch (err) {
            toast.error(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center">{existingReview ? "Edit Your Review" : "Leave a Review"}</h2>
                <p className="text-center text-gray-500 mb-4">Rate {specialistName}</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => setRating(star)}>
                                    <i className={`fas fa-star ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Your Review</label>
                        <textarea 
                            className="w-full p-2 border rounded" 
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg">
                        {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reviews;
