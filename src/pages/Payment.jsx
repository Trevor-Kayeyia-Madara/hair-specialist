import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { amount, customerName, specialistId, specialistName, serviceId } = location.state || {};

  return (
    <div>
      <h2>Payment for {specialistName}</h2>
      <p>Amount: {amount}</p>
      <p>Customer: {customerName}</p>
      <p>Specialist ID: {specialistId}</p>
      <p>Service ID: {serviceId}</p>
      {/* Add payment form here */}
    </div>
  );
};


export default Payment