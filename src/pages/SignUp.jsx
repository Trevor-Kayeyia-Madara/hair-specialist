import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("customer");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
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
      // Send user data to the backend API without hashing
      const response = await axios.post("https://backend-es6y.onrender.com/api/signup", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        userType,
      });

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

        <div className="flex gap-4 mb-6">
          <button onClick={() => setUserType("customer")} className={`flex-1 py-3 rounded-lg font-medium ${userType === "customer" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            Customer
          </button>
          <button onClick={() => setUserType("specialist")} className={`flex-1 py-3 rounded-lg font-medium ${userType === "specialist" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            Specialist
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-600">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {loading ? "Signing Up..." : `Sign Up as ${userType === "customer" ? "Customer" : "Specialist"}`}
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
