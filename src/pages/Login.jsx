import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Login Request
      const response = await fetch("https://backend-es6y.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const result = await response.json();
      console.log("Login Response:", JSON.stringify(result, null, 2)); // Debugging response

      if (!response.ok) throw new Error(result.message || "Login failed. Please try again.");

      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      // Step 2: Fetch User Details to Get ID
      const userDetailsResponse = await fetch("https://backend-es6y.onrender.com/api/users/:id", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${result.token}`,
          "Content-Type": "application/json",
        },
      });

      const userDetails = await userDetailsResponse.json();
      console.log("User Details Response:", JSON.stringify(userDetails, null, 2));

      if (!userDetailsResponse.ok) throw new Error("Failed to fetch user details");

      // Step 3: Extract ID and Store It
      const id = userDetails.id || userDetails.specialistId; // Handle both user types
      console.log("Extracted ID:", id);

      if (!id) throw new Error("User ID not found");

      localStorage.setItem("userId", id); // Save userId in localStorage

      // Step 4: Navigate to the Correct Page
      if (result.userType === "specialist") {
        navigate(`/specialist-dashboard/${id}`);
      } else {
        navigate(`/`);
      }

      // Refresh the page to update Navbar state
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign in</h2>

        {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            autoComplete="email"
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          Not having an account? <Link to="/sign-up">Sign up</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
