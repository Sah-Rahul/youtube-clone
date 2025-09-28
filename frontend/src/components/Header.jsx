import { useState } from "react";
import { FiMenu, FiSearch, FiUpload } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

const Header = () => {
  const { user, logout } = useUser();
  console.log(user);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button className="text-2xl md:hidden">
          <FiMenu />
        </button>
        <Link to="/" className="flex items-center space-x-1 cursor-pointer">
          <span className="font-bold text-xl hidden sm:inline text-red-600">
            MyTube
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-6 text-gray-600">
        {user ? (
          <>
            <Link
              to="/upload"
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Upload Video"
            >
              <FiUpload size={24} />
            </Link>

            <div className="relative group">
              <img
                src={
                  user.avatar ||
                  "https://randomuser.me/api/portraits/men/32.jpg"
                }
                alt="User Avatar"
                className="h-8 w-8 rounded-full cursor-pointer border-2 border-gray-300"
              />

              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
