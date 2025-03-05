import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Reviews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId, specialistId, specialistName } = location.state || {};
    
    const [rating, setRating] = useState(0);  // ✅ Default rating set to 0
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ✅ Prevent redirect until state is properly loaded
        if (customerId && specialistId) return;
        toast.error("Invalid review request.");
        navigate("/");
    }, [customerId, specialistId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.warning("⚠️ Please select a rating before submitting.");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("authToken");

        try {
            const response = await fetch("https://backend-es6y.onrender.com/api/reviews", {
                method: "POST",
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
            toast.success("✅ Review submitted successfully!");
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
                <h2 className="text-2xl font-bold text-center">Leave a Review</h2>
                <p className="text-center text-gray-500 mb-4">Rate {specialistName}</p>
                
                <form onSubmit={handleSubmit}>
                    {/* ✅ Star Rating Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="cursor-pointer outline-none"
                                >
                                    <i className={`fas fa-star text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Your Review</label>
                        <textarea 
                            className="w-full p-2 border rounded focus:outline-none"
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                    </div>

                    {/* ✅ Fix Submit Button Styling */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reviews;
