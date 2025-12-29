import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img
                src="https://imgur.com/VWlUj2J.png"
                alt="RoomReservation Logo"
                className="h-10 w-auto brightness-200"
              />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                RoomReserve
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              Room booking system that offers the best hospitality experience.
              Book your stay with ease.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>info@roomreserve.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RoomReserve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
