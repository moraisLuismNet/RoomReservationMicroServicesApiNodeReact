import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import { Reservation } from "../../models/reservation.model";

const AdminReservationsListPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const data = await adminService.getAllReservations();
        setReservations(
          data.filter(
            (r: any) =>
              !(
                (r.statusId && Number(r.statusId) === 5) ||
                (r.status &&
                  typeof r.status === "object" &&
                  Number((r.status as any).id) === 5)
              )
          )
        );
      } catch (err: any) {
        setError("Failed to load reservations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReservations();
  }, []);

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 2: // Confirmed
      case 6: // Paid
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            {statusId === 6 ? "Paid" : "Confirmed"}
          </span>
        );
      case 3: // Checked In
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Checked In
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
          Reservations Management
        </h1>
        <p className="text-gray-500">
          View and manage all room reservations across the platform.
        </p>
        <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-4"></div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="overflow-hidden bg-white shadow-xl rounded-2xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Check-in / Check-out
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Guests
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.length > 0 ? (
              reservations.map((res: any) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {res.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {res.userEmail || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    Room {res.room?.roomNumber || res.roomId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(res.checkInDate).toLocaleDateString()} -{" "}
                    {new Date(res.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {res.numberOfGuests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(res.statusId)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No active reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservationsListPage;
