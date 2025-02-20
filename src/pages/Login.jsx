/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const navigate = useNavigate();

  // Clear timeout warning when component unmounts
  useEffect(() => {
    let warningTimer;
    
    if (loading) {
      // Show a warning after 5 seconds if still loading
      warningTimer = setTimeout(() => {
        setTimeoutWarning(true);
      }, 5000);
    }
    
    return () => {
      clearTimeout(warningTimer);
    };
  }, [loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeoutWarning(false);
    
    try {
      // Add a timeout to the fetch operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch("https://backend-es6y.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        signal: controller.signal,
        // Add cache control headers
        cache: "no-cache"
      });
      
      clearTimeout(timeoutId);
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || "Login failed. Please try again.");
      
      // Save auth token if returned from backend
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }
      
      // Redirect user
      if (result.userType === "customer") {
        navigate("/");
      } else {
        navigate("/specialist-dashboard");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Login request timed out. The server might be busy or offline.");
      } else {
        setError(err.message || "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign in</h2>
        
        {timeoutWarning && loading && (
          <div className="my-3 p-2 bg-yellow-50 text-yellow-700 text-sm rounded">
            Sign in is taking longer than usual. This might be because the server is waking up from sleep mode.
          </div>
        )}
        
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
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <p className="text-center mt-4">
          Don't have an account? <a href="/sign-up" className="text-blue-600">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;