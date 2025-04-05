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
import InvoiceGenerator from "./pages/InvoiceGenerator";
import ChatComponent from "./components/ChatComponent";
import ReviewForm from "./pages/ReviewForm";

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/booking/:id" element={<BookingForm />} />
          <Route path="/invoice" element={<InvoiceGenerator />} />
          <Route path="/customer-dashboard/:id" element={<UserDashboard />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/review-form" element={<ReviewForm />} /> 
          <Route path="/specialist-dashboard/:id" element={<SpecialistDashboard />} />
          <Route path="/specialists/:id" element={<SpecialistProfile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/chat" element={<ChatComponent />} />
        </Routes>
      </Router>
    
  );
}

export default App;
