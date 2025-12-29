import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/apiClient";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const sessionId = searchParams.get("session_id");
  const reservationId = searchParams.get("reservation_id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        setErrorMessage("No session ID found.");
        return;
      }

      try {
        // Call the payment service to confirm the payment
        await apiClient.post("/api/payments/confirm", { sessionId });
        setStatus("success");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/my-reservations");
        }, 5000);
      } catch (error: any) {
        console.error("Error confirming payment:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Failed to confirm payment."
        );
      }
    };

    confirmPayment();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Processing Payment
              </h2>
              <p className="text-gray-500">
                Please wait while we confirm your reservation...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-green-600 font-medium mb-4">
                Payment Confirmed
              </p>
              <p className="text-gray-500 mb-6">
                Your reservation <strong>#{reservationId}</strong> has been
                confirmed.
              </p>
              <p className="text-sm text-gray-400">
                Redirecting to your reservations...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-red-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => navigate("/")}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Home
              </button>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure Environment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
