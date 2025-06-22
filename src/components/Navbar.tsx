// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NavLink {
  to: string;
  label: string;
}

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: NavLink[] = [
    { to: "/", label: "Home" },
    { to: "/weather", label: "Weather" },
    { to: "/history", label: "History" },
  ];

  const isActive = (to: string) => location.pathname === to;

  const confirmLogout = () => {
    const id = toast.info(
      <div className="space-y-2 text-sm text-neutral-800">
        <p>Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={async () => {
              await logout();
              toast.dismiss(id);
            }}
            className="px-3 py-1 bg-[#eb6f4b] text-neutral-100 rounded hover:bg-opacity-90"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(id)}
            className="px-3 py-1 bg-neutral-300 text-neutral-800 rounded hover:bg-neutral-400"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <nav className="relative bg-neutral-800 text-neutral-100 px-4 py-3 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/openWeather.png"
            alt="OpenWeather Logo"
            className="h-8 lg:h-10"
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex lg:ml-6 lg:space-x-8 lg:text-lg">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`px-2 py-1 transition-colors ${
                  isActive(link.to)
                    ? "text-[#eb6f4b] "
                    : "hover:text-neutral-200"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Logout */}
        <button
          onClick={confirmLogout}
          className="hidden lg:block ml-auto px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="lg:hidden ml-auto p-2"
        >
          {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full left-0 w-full bg-neutral-700 lg:hidden z-10 transform origin-top transition-transform duration-300 ${
            mobileOpen ? "scale-y-100" : "scale-y-0"
          }`}
        >
          <ul className="flex flex-col p-4 space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded transition-colors ${
                    isActive(link.to)
                      ? "text-[#eb6f4b] bg-neutral-600"
                      : "text-neutral-100 hover:bg-neutral-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  confirmLogout();
                }}
                className="w-full text-center px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
