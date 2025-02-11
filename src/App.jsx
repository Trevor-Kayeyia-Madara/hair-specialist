import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Search from "./pages/Search";
import BookingFlow from "./pages/BookingFlow";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path ="/search" element={<Search />} />
          <Route path="/booking" element={<BookingFlow />} />
        </Routes>
    </Router>
  )
}

export default App