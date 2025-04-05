import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    userType: "",
    phone_number: "",
    address: "",
    speciality: "",
    service_rates: "",
    location: "",
    rating: "",
    opening_time: "",
    closing_time: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://backend-es6y.onrender.com/api/signup", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {loading && <Loader />}
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 font-roboto">Create an Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="full_name" id="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-600">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User  Type</label>
            <select name="userType" id="userType" value={formData.userType} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Select User Type</option>
              <option value="customer">Customer</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>

          {formData.userType === "customer" && (
            <>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" name="phone_number" id="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="address" id="address" placeholder="Location" value={formData.address} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {formData.userType === "specialist" && (
            <>
              <div>
                <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">Speciality</label>
                <input type="text" name="speciality" id="speciality" placeholder="Speciality" value={formData.speciality} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="service_rates" className="block text-sm font-medium text-gray-700">Service Rates</label>
                <input type="text" name="service_rates" id="service_rates" placeholder="Service Rates" value={formData.service_rates} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" name="location" id="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <input type="text" name="rating" id="rating" placeholder="Rating" value={formData.rating} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="opening_time" className="block text-sm font-medium text-gray-700">Opening Time</label>
                <input type="time" name="opening_time" id="opening_time" value={formData.opening_time} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="closing_time" className="block text-sm font-medium text-gray-700">Closing Time</label>
                <input type="time" name="closing_time" id="closing_time" value={formData.closing_time} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {loading ? "Signing Up..." : "Submit"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;