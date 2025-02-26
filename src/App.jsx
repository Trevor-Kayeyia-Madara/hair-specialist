import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Search from "./pages/Search";
import BookingForm from "./pages/BookingForm";
import UserDashboard from "./pages/UserDashboard";
import Reviews from "./pages/Reviews";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import SpecialistProfile from "./pages/SpecialistProfile";
import Payment from "./pages/Payment";
import ChatWindow from "./components/ChatWindow";
import InvoiceGenerator from "./pages/InvoiceGenerator";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path ="/search" element={<Search />} />
          <Route path="/booking/:id" element={<BookingForm />} />
          <Route path="/invoice/:id" element={<InvoiceGenerator />} />
          <Route path="/chat/:id" element={<ChatWindow />} />
          <Route path="/dashboard" element={<UserDashboard  />} />
          <Route path="/reviews" element={<Reviews  />} />
          <Route path="/specialist-dashboard/:id" element={<SpecialistDashboard />} />
          <Route path="/specialists/:id" element={<SpecialistProfile />} />
          <Route path="/payment" element={<Payment  />} />
        </Routes>
    </Router>
  )
}

export default App