 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState({ password: "", confirm: "" });

  const navigate = useNavigate();

  // Clear timeout warning when component unmounts
  useEffect(() => {
    let warningTimer;
    if (loading) {
      warningTimer = setTimeout(() => setTimeoutWarning(true), 5000);
    }
    return () => clearTimeout(warningTimer);
  }, [loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeoutWarning(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const url = resetMode
        ? "https://backend-es6y.onrender.com/api/update-password"
        : "https://backend-es6y.onrender.com/api/login";

      const body = resetMode
        ? JSON.stringify({ password: newPassword.password, confirm: newPassword.confirm })
        : JSON.stringify({ email: formData.email, password: formData.password });

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Operation failed. Please try again.");

      if (!resetMode) {
        if (result.token) {
          localStorage.setItem("authToken", result.token);
        }
        navigate(result.userType === "customer" ? "/" : "/specialist-dashboard");
      } else {
        alert("Password reset successful! Please log in.");
        setResetMode(false);
      }
    } catch (err) {
      setError(err.name === "AbortError" ? "Request timed out." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold">{resetMode ? "Set New Password" : "Sign in"}</h2>

        {timeoutWarning && loading && (
          <div className="my-3 p-2 bg-yellow-50 text-yellow-700 text-sm rounded">
            This is taking longer than usual. The server might be waking up.
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {resetMode ? (
            <>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={newPassword.password}
                onChange={handleNewPasswordChange}
                className="w-full p-3 border rounded"
                required
                disabled={loading}
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm New Password"
                value={newPassword.confirm}
                onChange={handleNewPasswordChange}
                className="w-full p-3 border rounded"
                required
                disabled={loading}
              />
            </>
          ) : (
            <>
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
            </>
          )}

          {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

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
                {resetMode ? "Resetting..." : "Signing in..."}
              </>
            ) : resetMode ? (
              "Reset Password"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-4">
          {resetMode ? (
            <button className="text-blue-600" onClick={() => setResetMode(false)}>
              Back to Sign In
            </button>
          ) : (
            <>
              <button className="text-blue-600" onClick={() => setResetMode(true)}>
                New Password
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
