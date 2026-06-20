import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/order_success");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      {/* Floating Card */}
      <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center animate-fadeIn max-w-md w-full mx-4 border border-blue-100">
        
        {/* Glowing Animated Loader */}
        <div className="relative">
          <div className="w-28 h-28 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 blur-xl bg-blue-200 rounded-full opacity-40 animate-pulse"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 text-center">
          Processing your payment
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mt-2 text-center">
          Please wait while we verify your payment securely
        </p>

        {/* Animated bouncing dots */}
        <div className="flex gap-2 mt-6">
          <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150"></span>
          <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>

    </div>
  );
};

export default PaymentProcessing;
