import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { adminService } from "../../services/admin.service";
import { Reservation } from "../../models/reservation.model";

const AdminReservationsCalendarPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentBookings, setCurrentBookings] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState<
    "dayGridMonth" | "dayGridWeek"
  >("dayGridMonth");
  const [currentDateRange, setCurrentDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    updateCurrentBookings();
  }, [reservations, currentDateRange]);

  const fetchReservations = async () => {
    try {
      const data = await adminService.getAllReservations();
      setReservations(data);
    } catch (err: any) {
      setError("Failed to load global reservations calendar.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentBookings = () => {
    if (!reservations || reservations.length === 0) return;

    // Filter reservations that overlap with the current date range
    const filtered = reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Check if the reservation overlaps with the current view period
      // statusId 5 and 6 are usually Cancelled/Failed
      return (
        checkIn <= currentDateRange.end &&
        checkOut >= currentDateRange.start &&
        !(
          (reservation.statusId && Number(reservation.statusId) === 5) ||
          (reservation.status &&
            typeof reservation.status === "object" &&
            Number((reservation.status as any).id) === 5)
        )
      );
    });
    setCurrentBookings(filtered);
  };

  const getUniqueRooms = (): number[] => {
    return [
      ...new Set(currentBookings.map((booking) => booking.roomId)),
    ] as number[];
  };

  const getTotalGuests = (): number => {
    return currentBookings.reduce(
      (sum, booking) => sum + (booking.numberOfGuests || 0),
      0
    );
  };

  const handleDatesSet = (dateInfo: any) => {
    setCurrentDateRange({
      start: dateInfo.start,
      end: dateInfo.end,
    });
    setCurrentView(dateInfo.view.type);
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
          Reservations Calendar
        </h1>
        <p className="text-gray-500">
          Global overview of all bookings across all rooms.
        </p>
        <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-4"></div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-100 mb-8">
        {/* Booking Summary Section */}
        <div className="mb-6 p-6 bg-indigo-50 rounded-2xl">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">
            Reservations{" "}
            {currentView === "dayGridMonth" ? "Of The Month" : "of the Week"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100">
              <div className="text-sm font-medium text-gray-500">
                Total Reservations
              </div>
              <div className="text-3xl font-bold text-indigo-900">
                {currentBookings.length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100">
              <div className="text-sm font-medium text-gray-500">
                Occupied Rooms
              </div>
              <div className="text-3xl font-bold text-indigo-900">
                {getUniqueRooms().length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100">
              <div className="text-sm font-medium text-gray-500">
                Total Guests
              </div>
              <div className="text-3xl font-bold text-indigo-900">
                {getTotalGuests()}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-3">
              Active Reservations:
            </h3>
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-100/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentBookings.length > 0 ? (
                      currentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-indigo-50/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            Room {booking.room?.roomNumber || booking.roomId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {booking.userEmail || "not specified"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(
                              booking.checkOutDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {booking.numberOfGuests}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getStatusBadge(booking.statusId)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          There are no bookings during this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="calendar-container mt-8">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={reservations
              .filter(
                (r: any) =>
                  !(
                    (r.statusId && Number(r.statusId) === 5) ||
                    (r.status &&
                      typeof r.status === "object" &&
                      Number((r.status as any).id) === 5)
                  )
              )
              .map((res: any) => ({
                id: res.id.toString(),
                title: `Room ${res.room?.roomNumber || res.roomId} (${
                  res.numberOfGuests
                }p)`,
                start: res.checkInDate,
                end: res.checkOutDate,
                allDay: true,
                extendedProps: {
                  user: res.userEmail,
                },
              }))}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            eventColor="#3730a3"
            displayEventTime={false}
            datesSet={handleDatesSet}
            eventClick={(info) => {
              const user = info.event.extendedProps.user || "Not specified";
              alert(
                `Reservation ID: ${info.event.id}\n${info.event.title}\nGuest: ${user}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsCalendarPage;
