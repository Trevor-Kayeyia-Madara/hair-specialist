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
          <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-600">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <select name="userType" value={formData.userType} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Select User Type</option>
            <option value="customer">Customer</option>
            <option value="specialist">Specialist</option>
          </select>

          {formData.userType === "customer" && (
            <>
              <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="location" placeholder="Address" value={formData.address} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </>
          )}

          {formData.userType === "specialist" && (
            <>
              <input type="text" name="speciality" placeholder="Speciality" value={formData.speciality} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="service_rates" placeholder="Service Rates" value={formData.service_rates} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="rating" placeholder="Rating" value={formData.rating} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="time" name="opening_time" placeholder="Opening time" value={formData.opening_time} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              <input type="time" name="closing_time" placeholder="Opening time" value={formData.closing_time} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
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
