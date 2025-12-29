import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roomService } from "../../services/room.service";
import { roomTypeService } from "../../services/room-type.service";
import { RoomType } from "../../models/room-type.model";

const AddRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomTypeId: "",
    isActive: true,
    imageRoom: "",
  });

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await roomTypeService.getRoomTypes();
        setRoomTypes(types);
        if (types.length > 0) {
          setFormData((prev) => ({
            ...prev,
            roomTypeId: types[0].id.toString(),
          }));
        }
      } catch (err) {
        setError("Failed to load room types. Please try again later.");
      }
    };
    fetchRoomTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await roomService.createRoom({
        ...formData,
        roomTypeId: parseInt(formData.roomTypeId),
      });
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create room. Please check the data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add New Room
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new accommodation for your guests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Room Number
              </label>
              <div className="mt-1">
                <input
                  id="roomNumber"
                  name="roomNumber"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g. 101, A-12"
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="roomTypeId"
                className="block text-sm font-medium text-gray-700"
              >
                Room Type
              </label>
              <div className="mt-1">
                <select
                  id="roomTypeId"
                  name="roomTypeId"
                  required
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.roomTypeId}
                  onChange={handleChange}
                >
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} (Max: {type.capacity}, ${type.pricePerNight})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="imageRoom"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <div className="mt-1">
                <input
                  id="imageRoom"
                  name="imageRoom"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageRoom}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-900"
              >
                Is Active (Available for booking)
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                  isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? "Creating..." : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomPage;
