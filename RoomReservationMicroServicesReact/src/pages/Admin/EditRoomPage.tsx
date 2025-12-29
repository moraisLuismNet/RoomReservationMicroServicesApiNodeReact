import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roomService } from "../../services/room.service";
import { roomTypeService } from "../../services/room-type.service";
import { RoomType } from "../../models/room-type.model";
import ConfirmModal from "@/components/common/ConfirmModal";

const EditRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomTypeId: "",
    isActive: true,
    imageRoom: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [types, room] = await Promise.all([
          roomTypeService.getRoomTypes(),
          roomService.getRoom(Number(id)),
        ]);

        setRoomTypes(types);
        setFormData({
          roomNumber: room.roomNumber,
          roomTypeId: room.roomTypeId.toString(),
          isActive: room.isActive,
          imageRoom: room.imageRoom || "",
        });
      } catch (err) {
        setError("Failed to load room data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

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
    setIsSaving(true);
    setError("");

    try {
      await roomService.updateRoom(Number(id), {
        ...formData,
        roomTypeId: parseInt(formData.roomTypeId),
      });
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update room. Please check the data."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    setModalOpen(false);
    setIsDeleting(true);
    setError("");
    try {
      await roomService.deleteRoom(Number(id));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete room.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Manage Room
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Update details or remove room {formData.roomNumber}
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

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                  isSaving || isDeleting
                    ? "opacity-75 cursor-not-allowed"
                    : "transform hover:-translate-y-0.5"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className={`w-full flex justify-center py-3 px-4 border border-red-200 rounded-xl shadow-sm text-sm font-semibold text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${
                  isSaving || isDeleting
                    ? "opacity-75 cursor-not-allowed"
                    : "transform hover:-translate-y-0.5"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        isOpen={modalOpen}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmLabel="Yes, Delete Room"
        cancelLabel="Keep Room"
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        variant="danger"
      />
    </div>
  );
};

export default EditRoomPage;
