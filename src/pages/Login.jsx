import { useState } from "react";
import { loginUser } from "../lib/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
