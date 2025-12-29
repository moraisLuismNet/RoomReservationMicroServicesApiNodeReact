import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { reservationService } from "@/services/reservation.service";

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservation_id");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const cancelPendingReservation = async () => {
      if (reservationId) {
        try {
          await reservationService.cancelReservation(parseInt(reservationId));
        } catch (error) {
          console.error("Failed to cancel pending reservation:", error);
        }
      }
      setIsProcessing(false);
    };

    cancelPendingReservation();
  }, [reservationId]);

  if (isProcessing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cancelling pending reservation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="h-10 w-10 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment Cancelled
          </h2>
          <p className="text-gray-500 mb-6 font-medium">
            Your payment process was interrupted. The pending reservation has
            been automatically cancelled.
            {reservationId && (
              <span className="block mt-2 font-bold text-gray-700">
                Reservation #{reservationId}
              </span>
            )}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/my-reservations")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View My Reservations
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
