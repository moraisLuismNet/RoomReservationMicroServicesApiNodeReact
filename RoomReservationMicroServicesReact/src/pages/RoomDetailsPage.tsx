import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@/context/AuthContext";
import { roomService } from "@/services/room.service";
import { reservationService } from "@/services/reservation.service";
import { paymentService } from "@/services/payment.service";
import { roomTypeService } from "@/services/room-type.service";
import { Room } from "@/models/room.model";
import { Reservation } from "@/models/reservation.model";
import { RoomType } from "@/models/room-type.model";
import ConfirmModal from "@/components/common/ConfirmModal";

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
  });

  const [editFormData, setEditFormData] = useState({
    roomNumber: "",
    roomTypeId: "",
    isActive: true,
    imageRoom: "",
  });

  const [minDates, setMinDates] = useState({
    checkIn: "",
    checkOut: "",
  });

  const getReservedDates = (reservations: Reservation[]): string[] => {
    const dates: string[] = [];
    reservations.forEach((reservation) => {
      const isCancelled =
        (reservation.statusId && Number(reservation.statusId) === 5) ||
        (reservation.status &&
          typeof reservation.status === "object" &&
          Number((reservation.status as any).id) === 5) ||
        reservation.status === "cancelled";

      const isPending =
        (reservation.statusId && Number(reservation.statusId) === 1) ||
        (reservation.status &&
          typeof reservation.status === "object" &&
          Number((reservation.status as any).id) === 1) ||
        reservation.status === "pending";

      if (isCancelled || isPending) return;
      // Basic inclusion logic
      const start = new Date(reservation.checkInDate);
      const end = new Date(reservation.checkOutDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split("T")[0]);
      }
    });
    return dates;
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDates({ checkIn: today, checkOut: today });

    const fetchData = async () => {
      if (!id) return;
      try {
        const roomId = parseInt(id);
        const [roomData, reservationData, typesData] = await Promise.all([
          roomService.getRoom(roomId),
          reservationService.getReservationsByRoom(roomId),
          roomTypeService.getRoomTypes(), // Always fetch for edit mode
        ]);
        setRoom(roomData);
        setReservations(reservationData);
        setReservedDates(getReservedDates(reservationData));
        setRoomTypes(typesData);

        setEditFormData({
          roomNumber: roomData.roomNumber,
          roomTypeId: roomData.roomTypeId.toString(),
          isActive: roomData.isActive,
          imageRoom: roomData.imageRoom || "",
        });
      } catch (err: any) {
        setMessage("Failed to load room details.");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "checkInDate" ? { checkOutDate: "" } : {}),
    }));

    if (name === "checkInDate" && value) {
      const nextDay = new Date(value);
      if (!isNaN(nextDay.getTime())) {
        nextDay.setDate(nextDay.getDate() + 1);
        setMinDates((prev) => ({
          ...prev,
          checkOut: nextDay.toISOString().split("T")[0],
        }));
      }
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const calculateNights = (start: string, end: string) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = d2.getTime() - d1.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const isDateReserved = (checkIn: string, checkOut: string): boolean => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const formatted = d.toISOString().split("T")[0];
      if (reservedDates.includes(formatted)) return true;
    }
    return false;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !user) return;

    if (isDateReserved(bookingData.checkInDate, bookingData.checkOutDate)) {
      setMessage("Selected dates are already reserved.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setMessage("Creating reservation...");
    setIsError(false);

    try {
      const nights = calculateNights(
        bookingData.checkInDate,
        bookingData.checkOutDate
      );
      const reservation = await reservationService.createReservation({
        roomId: room.roomId,
        checkInDate: new Date(bookingData.checkInDate).toISOString(),
        checkOutDate: new Date(bookingData.checkOutDate).toISOString(),
        numberOfGuests: bookingData.numberOfGuests,
        email: user.email,
        reservationDate: new Date().toISOString(),
        numberOfNights: nights,
        totalPrice: room.roomType.pricePerNight * nights,
      });

      const totalAmount = room.roomType.pricePerNight * nights;
      const checkoutSession = await paymentService.createCheckoutSession({
        reservationId: reservation.id,
        amount: totalAmount,
        currency: "eur",
        productName: `Room ${room.roomNumber} Reservation`,
        productDescription: `Check-in: ${bookingData.checkInDate} | Check-out: ${bookingData.checkOutDate} | ${nights} nights`,
        userEmail: user.email,
      });

      paymentService.redirectToCheckout(checkoutSession.sessionUrl);
    } catch (err: any) {
      setMessage(err.message || "Failed to create reservation.");
      setIsError(true);
      setIsSubmitting(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && room) {
      setEditFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId.toString(),
        isActive: room.isActive,
        imageRoom: room.imageRoom || "",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setMessage("");

    try {
      await roomService.updateRoom(Number(id), {
        ...editFormData,
        roomTypeId: parseInt(editFormData.roomTypeId),
      });
      const updatedRoom = await roomService.getRoom(Number(id));
      setRoom(updatedRoom);
      setIsEditMode(false);
      setMessage("Room updated successfully");
      setIsError(false);
    } catch (err: any) {
      setMessage("Failed to update room.");
      setIsError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => setModalOpen(true);

  const confirmDelete = async () => {
    if (!id) return;
    setModalOpen(false);
    try {
      await roomService.deleteRoom(Number(id));
      navigate("/");
    } catch (err: any) {
      setMessage("Failed to delete room. Ensure it has no reservations.");
      setIsError(true);
    }
  };

  const resetForm = () => {
    setBookingData({
      checkInDate: "",
      checkOutDate: "",
      numberOfGuests: 1,
    });
    setMessage("");
    setIsError(false);
    const today = new Date().toISOString().split("T")[0];
    setMinDates({ checkIn: today, checkOut: today });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (!room)
    return (
      <div className="text-center py-20 text-gray-500">Room not found.</div>
    );

  const nights = calculateNights(
    bookingData.checkInDate,
    bookingData.checkOutDate
  );
  const totalPrice = room.roomType.pricePerNight * nights;

  const hasFutureReservations = reservations.some((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(r.checkInDate);
    // Check if status is not Cancelled (5)
    const isCancelled =
      (r.statusId && Number(r.statusId) === 5) ||
      (r.status &&
        typeof r.status === "object" &&
        Number((r.status as any).id) === 5) ||
      r.status === "cancelled";

    return !isCancelled && checkIn >= today;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-6">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          {/* LEFT AREA: Header + Calendar */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Room {room.roomNumber}
            </h1>
            <div className="mt-6">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek",
                }}
                events={reservations
                  .filter((r) => {
                    const isCancelled =
                      (r.statusId && Number(r.statusId) === 5) ||
                      (r.status &&
                        typeof r.status === "object" &&
                        Number((r.status as any).id) === 5) ||
                      r.status === "cancelled";

                    const isPending =
                      (r.statusId && Number(r.statusId) === 1) ||
                      (r.status &&
                        typeof r.status === "object" &&
                        Number((r.status as any).id) === 1) ||
                      r.status === "pending";

                    return !isCancelled && !isPending;
                  })
                  .map((r) => ({
                    title: "Reserved",
                    start: r.checkInDate,
                    end: r.checkOutDate,
                    color: "red",
                    allDay: true,
                  }))}
                height="auto"
                eventColor="red"
                displayEventTime={false}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR: Options / Booking Form */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <h2 className="text-xl font-bold text-gray-900">Book this room</h2>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="mb-6 mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex space-x-3">
                  <button
                    onClick={toggleEditMode}
                    disabled={hasFutureReservations}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isEditMode ? "Cancel Edit" : "Edit Room"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={hasFutureReservations}
                    title="Cannot edit or delete if room has future reservations"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Delete Room
                  </button>
                </div>

                {isEditMode && (
                  <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Room Number
                      </label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={editFormData.roomNumber}
                        onChange={handleEditInputChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        placeholder="Room Number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Room Type (Affects Price/Desc)
                      </label>
                      <select
                        name="roomTypeId"
                        value={editFormData.roomTypeId}
                        onChange={handleEditInputChange}
                        required
                        className="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        {roomTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name} (€{type.pricePerNight}/night)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="imageRoom"
                        value={editFormData.imageRoom}
                        onChange={handleEditInputChange}
                        className="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="isActive_admin"
                        type="checkbox"
                        name="isActive"
                        checked={editFormData.isActive}
                        onChange={handleEditInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="isActive_admin"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Active
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {!isEditMode && (
              <p className="text-3xl text-gray-900 mt-2">
                €{room.roomType.pricePerNight} / night
              </p>
            )}

            {!isAuthenticated ? (
              <div className="mt-8">
                <p className="text-gray-500 mb-4">
                  You need to be logged in to make a reservation.
                </p>
                <Link
                  to="/login"
                  className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Sign in to book
                </Link>
              </div>
            ) : (
              !isAdmin && (
                <div className="mt-8">
                  <form onSubmit={handleBookingSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          name="checkInDate"
                          min={minDates.checkIn}
                          value={bookingData.checkInDate}
                          onChange={handleBookingInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          name="checkOutDate"
                          min={minDates.checkOut}
                          value={bookingData.checkOutDate}
                          onChange={handleBookingInputChange}
                          required
                          disabled={!bookingData.checkInDate}
                          className="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          name="numberOfGuests"
                          min="1"
                          max={room.roomType.capacity}
                          value={bookingData.numberOfGuests}
                          onChange={(e) =>
                            setBookingData((prev) => ({
                              ...prev,
                              numberOfGuests: parseInt(e.target.value) || 1,
                            }))
                          }
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>

                      {message && (
                        <div
                          className={`text-sm font-medium ${
                            isError ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {message}
                        </div>
                      )}

                      {/* Calculated Total Price */}
                      {totalPrice > 0 && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              Total ({nights} nights)
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                              €{totalPrice}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        {bookingData.checkInDate &&
                          bookingData.checkOutDate && (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting
                            ? "Processing..."
                            : "Proceed to Payment"}
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 text-center mt-2">
                        You will be redirected to Stripe for secure payment
                      </p>
                    </div>
                  </form>
                </div>
              )
            )}

            {!isAdmin && (
              <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <div>
                  <h3 className="sr-only">Description</h3>
                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {room.roomType.description ||
                        "Experience the ultimate in comfort and style in our carefully curated space."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
        confirmLabel="Yes, Delete Room"
        cancelLabel="Keep Room"
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        variant="danger"
      />
    </div>
  );
};

export default RoomDetailsPage;
