import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { reservationService } from "@/services/reservation.service";
import { Reservation } from "@/models/reservation.model";
import ConfirmModal from "@/components/common/ConfirmModal";

const MyReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.email) return;
      try {
        const data = await reservationService.getMyReservations(user.email);
        setReservations(
          data.filter(
            (r) =>
              (r.statusId && Number(r.statusId) !== 5) ||
              (r.status &&
                typeof r.status === "object" &&
                Number((r.status as any).id) !== 5)
          )
        ); // Filter out cancelled (5)
      } catch (err: any) {
        setError("Failed to load your reservations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const canCancel = (checkInDate: string) => {
    const checkIn = new Date(checkInDate);
    const now = new Date();
    const diffInMs = checkIn.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours >= 24;
  };

  const handleCancel = (id: number) => {
    setReservationToCancel(id);
    setModalOpen(true);
  };

  const confirmCancel = async () => {
    if (reservationToCancel === null) return;
    setModalOpen(false);
    try {
      await reservationService.cancelReservation(reservationToCancel);
      setReservations((prev) =>
        prev.filter((res) => res.id !== reservationToCancel)
      );
    } catch (err: any) {
      alert(err.message || "Failed to cancel reservation.");
    } finally {
      setReservationToCancel(null);
    }
  };

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 2: // Confirmed
      case 6: // Paid
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            {statusId === 6 ? "Paid" : "Confirmed"}
          </span>
        );
      case 5: // Cancelled
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  const getGoogleCalendarUrl = (res: Reservation) => {
    const title = encodeURIComponent(
      `Reservation at RoomReserve - ${res.room?.roomNumber || res.roomId}`
    );
    const details = encodeURIComponent(
      `Booking for ${res.numberOfGuests} guests.`
    );
    const start = new Date(res.checkInDate)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")
      .split("T")[0];
    const end = new Date(res.checkOutDate)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")
      .split("T")[0];
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          My Reservations
        </h1>
        <p className="text-gray-500">
          View and manage your upcoming stays at RoomReserve.
        </p>
        <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-4"></div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-600 text-lg font-medium">
            No reservations found.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Explore our rooms →
          </button>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow-xl rounded-2xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold">
                        {res.room?.roomNumber || res.roomId}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          Room {res.room?.roomNumber || res.roomId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {res.room?.roomType?.name || "Premium Stay"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {new Date(res.checkInDate).toLocaleDateString()} -{" "}
                      {new Date(res.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {res.numberOfNights} Nights | {res.numberOfGuests} Guests
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(res.statusId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <Link
                      to={`/rooms/${res.roomId}`}
                      className="text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                    >
                      Details
                    </Link>
                    <a
                      href={getGoogleCalendarUrl(res)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Add to Calendar
                    </a>
                    {res.statusId !== 5 && (
                      <button
                        onClick={() => handleCancel(res.id)}
                        disabled={!canCancel(res.checkInDate)}
                        className={`${
                          canCancel(res.checkInDate)
                            ? "text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100"
                            : "text-gray-400 bg-gray-50 cursor-not-allowed"
                        } px-3 py-1.5 rounded-lg transition-colors font-semibold`}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        isOpen={modalOpen}
        title="Cancel Reservation"
        message="Are you sure you want to cancel this reservation? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Reservation"
        onConfirm={confirmCancel}
        onCancel={() => {
          setModalOpen(false);
          setReservationToCancel(null);
        }}
        variant="danger"
      />
    </div>
  );
};

export default MyReservationsPage;
