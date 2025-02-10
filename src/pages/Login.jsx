/* eslint-disable react/no-unescaped-entities */
import {useState} from 'react'

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
    
      const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
    
          if (data.userType === "customer") {
            window.location.href = "/dashboard";
          } else if (data.userType === "specialist") {
            window.location.href = "/specialist-dashboard";
          }
        } catch (err) {
            console.error("Error during login:", err);
          setError("Invalid email or password");
        } finally {
          setLoading(false);
        }
      };
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
    
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
    
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <i className="fas fa-spinner fa-spin"></i>
                    </span>
                  ) : null}
                  Sign in
                </button>
              </div>
    
              <div className="text-sm text-center">
                <a
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Don't have an account? Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
  )
}

export default Login