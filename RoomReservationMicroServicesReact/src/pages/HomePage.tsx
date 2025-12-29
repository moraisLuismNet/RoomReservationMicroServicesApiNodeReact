import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Room } from "../models/room.model";
import { roomService } from "../services/room.service";
import { useAuth } from "@/context/AuthContext";

const HomePage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getRooms();
        setRooms(data);
      } catch (err: any) {
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 py-8 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-fade-in-up">
            Find your perfect stay <br />
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Experience unparalleled comfort and service in our selection of
            rooms
          </p>
        </div>
      </div>

      {/* Room Listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Available Rooms
            </h2>
            <div className="h-1.5 w-20 bg-indigo-600 rounded-full mt-2"></div>
          </div>
          {isAdmin && (
            <Link
              to="/admin/rooms/new"
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 transform hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add New Room</span>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {rooms.length > 0 ? (
                rooms
                  .slice(
                    (currentPage - 1) * roomsPerPage,
                    currentPage * roomsPerPage
                  )
                  .map((room) => (
                    <div
                      key={room.roomId}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={
                            room.imageRoom || "https://imgur.com/Zemqvh3.png"
                          }
                          alt={room.roomNumber}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-600 font-bold text-sm shadow-sm">
                            ${room.roomType.pricePerNight}/night
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {room.roomNumber}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {room.roomType.description ||
                            "A beautiful and spacious room designed for your absolute comfort. Enjoy premium amenities and a relaxing atmosphere."}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Capacity: {room.roomType.capacity}
                          </span>
                        </div>
                        {!isAdmin && (
                          <Link
                            to={`/rooms/${room.roomId}`}
                            className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-indigo-200"
                          >
                            Book Now
                          </Link>
                        )}
                        {isAdmin && (
                          <div className="flex flex-col space-y-2">
                            <Link
                              to={`/rooms/${room.roomId}`}
                              className="w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-indigo-200"
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No rooms available at the moment.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {rooms.length > roomsPerPage && (
              <div className="flex justify-center items-center space-x-2 pb-8">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300"
                  }`}
                >
                  Previous
                </button>

                {Array.from(
                  { length: Math.ceil(rooms.length / roomsPerPage) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, Math.ceil(rooms.length / roomsPerPage))
                    );
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  disabled={
                    currentPage === Math.ceil(rooms.length / roomsPerPage)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === Math.ceil(rooms.length / roomsPerPage)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
