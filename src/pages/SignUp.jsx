import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // For eye icons

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SignUp = () => {
  const [userType, setUserType] = useState("customer");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility

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
      // Hash password using Supabase function
      const { data, error: hashError } = await supabase.rpc("hash_password", {
        raw_password: formData.password,
      });

      if (hashError) throw hashError;
      const hashedPassword = data;

      // Insert user data into the database
      const { error: insertError } = await supabase.from("users").insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          password: hashedPassword, // Store hashed password
          userType,
        },
      ]);

      if (insertError) throw insertError;

      // Redirect based on user type
      window.location.href = userType === "customer" ? "/dashboard" : "/specialist-dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 font-roboto">Create an Account</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUserType("customer")}
            className={`flex-1 py-3 rounded-lg font-medium ${
              userType === "customer" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setUserType("specialist")}
            className={`flex-1 py-3 rounded-lg font-medium ${
              userType === "specialist" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Specialist
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
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
