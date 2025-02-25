import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const [paymentData] = useState(() => {
    // Get data from location state or fallback to localStorage
    return location.state || JSON.parse(localStorage.getItem("paymentData")) || {};
  });

  useEffect(() => {
    if (location.state) {
      localStorage.setItem("paymentData", JSON.stringify(location.state));
    }
  }, [location.state]);

  if (!paymentData.amount) {
    return <p>⚠️ Payment details not found. Please go back and try again.</p>;
  }

  return (
    <div>
      <h2>Payment for {paymentData.specialistName}</h2>
      <p>Amount: {paymentData.amount}</p>
      <p>Customer: {paymentData.customerName}</p>
      <p>Specialist ID: {paymentData.specialistId}</p>
      <p>Service ID: {paymentData.serviceId}</p>
      {/* Add payment form here */}
    </div>
  );
};

export default Payment;
