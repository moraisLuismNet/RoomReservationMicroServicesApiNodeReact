import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Rooms", path: "/", show: true },
    {
      name: "My Reservations",
      path: "/my-reservations",
      show: isAuthenticated && !isAdmin,
    },
    {
      name: "Reservations List",
      path: "/admin/reservations/list",
      show: isAdmin,
    },
    {
      name: "Reservations Calendar",
      path: "/admin/reservations/calendar",
      show: isAdmin,
    },
    { name: "Users", path: "/admin/users", show: isAdmin },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 flex items-center group cursor-default`}
            >
              <img
                src="https://imgur.com/VWlUj2J.png"
                alt="RoomReservation Logo"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RoomReserve
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navLinks
                .filter((link) => link.show)
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={(e) => isActive(link.path) && e.preventDefault()}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-indigo-50 text-indigo-700 pointer-events-none cursor-default"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-500">
                    Welcome back, {user?.email}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
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
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } sm:hidden bg-white border-b border-gray-200`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  if (isActive(link.path)) {
                    e.preventDefault();
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? "bg-indigo-50 text-indigo-700 pointer-events-none cursor-default"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          {!isAuthenticated ? (
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2 px-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-indigo-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 bg-indigo-600 text-white rounded-md font-medium"
              >
                Register
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
