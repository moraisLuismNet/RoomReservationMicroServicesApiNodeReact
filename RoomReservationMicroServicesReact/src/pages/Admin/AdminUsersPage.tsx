import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import { User } from "../../models/user.model";

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err: any) {
        console.error("Error loading users:", err);
        const errorMessage = err.message || "Failed to load users list.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-500">
          Overview of all registered accounts in the system.
        </p>
        <div className="h-1.5 w-24 bg-indigo-600 rounded-full mt-4 mx-auto md:mx-0"></div>
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
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Member since 2024
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No users found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
