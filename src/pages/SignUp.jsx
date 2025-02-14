import { useState } from 'react';

const SignUp = () => {
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    full_name: '', // Added full_name
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
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
    setError('');
    setLoading(true);
  
    try {
      const response = await fetch('https://backend-es6y.onrender.com/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name, // Include full_name in the request
          email: formData.email,
          password: formData.password,
          userType,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
  
      // Redirect based on user type
      window.location.href = userType === 'customer' ? '/dashboard' : '/specialist-dashboard';
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
            onClick={() => setUserType('customer')}
            className={`flex-1 py-3 rounded-lg font-medium ${userType === 'customer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Customer
          </button>
          <button
            onClick={() => setUserType('specialist')}
            className={`flex-1 py-3 rounded-lg font-medium ${userType === 'specialist' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Specialist
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name}  onChange={handleInputChange}  required  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {loading ? 'Signing Up...' : `Sign Up as ${userType === 'customer' ? 'Customer' : 'Specialist'}`}
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