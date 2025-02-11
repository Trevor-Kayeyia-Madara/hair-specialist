import {useState} from 'react'

const Reviews = () => {
    const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setReview("");
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-montserrat text-gray-900 mb-4">
          Leave a Review
        </h1>
        <p className="text-xl font-roboto text-gray-600">
          Share your experience with our specialists
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
          <p className="text-green-800 font-roboto text-lg">
            Thank you for your review!
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <div className="mb-6">
            <label
              className="block font-roboto text-gray-700 mb-2"
              htmlFor="name"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-roboto text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  <i
                    className={`fas fa-star ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  ></i>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block font-roboto text-gray-700 mb-2"
              htmlFor="review"
            >
              Your Review
            </label>
            <textarea
              id="review"
              name="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-roboto py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-montserrat font-bold mb-6">
          Recent Reviews
        </h2>
        <div className="space-y-6">
          <div className="border-b pb-6">
            <div className="flex items-center mb-2">
              <div className="text-yellow-400 flex">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="ml-2 font-roboto text-gray-600">John D.</span>
            </div>
            <p className="font-roboto text-gray-700">
              Great experience with my specialist! Very professional and
              knowledgeable.
            </p>
          </div>
          <div className="border-b pb-6">
            <div className="flex items-center mb-2">
              <div className="text-yellow-400 flex">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="ml-2 font-roboto text-gray-600">Sarah M.</span>
            </div>
            <p className="font-roboto text-gray-700">
              Very satisfied with the service. Would definitely recommend!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Reviews