/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-login if session exists
    const userId = localStorage.getItem("userId");
    if (userId) {
      redirectUser(userId);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Fetch user from the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, password, userType")
        .eq("email", formData.email)
        .single();

      if (userError || !userData) throw new Error("Invalid email or user does not exist.");

      // Check password (Ensure passwords are hashed in production)
      if (userData.password !== formData.password) {
        throw new Error("Invalid password.");
      }

      // Store session data
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userType", userData.userType);

      // Redirect user
      redirectUser(userData.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = async (userId) => {
    const { data } = await supabase.from("users").select("userType").eq("id", userId).single();
    if (data?.userType === "customer") {
      navigate("/dashboard");
    } else {
      navigate("/specialist-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold">Sign in</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
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
