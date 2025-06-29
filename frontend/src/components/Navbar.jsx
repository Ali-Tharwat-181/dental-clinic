import React, { useState } from "react";
import logoImg from "../assets/WhatsApp Image 2025-06-23 at 11.19.52_c83fdc45.jpg";
import { Link } from "react-router";
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("adminToken");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    i18n.changeLanguage(newLang);
    window.location.reload();
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // close mobile menu if open
    }
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-40">
      <nav
        className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <a
            href="#hero"
            className="hover:text-blue-500 transition"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top smoothly
            }}
          >
            <img
              src={logoImg}
              alt="Ever Care Dental Clinic Logo"
              className="w-24 h-24 rounded-full object-cover hover:scale-105 transition"
            />
          </a>
          {/* <h1 className="text-2xl font-bold text-gray-800">
            Ever Care Dental Clinic
          </h1> */}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-7 text-blue-700 font-medium">
          <Link
            to="/reservation"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            {t('Book Appointment')}
          </Link>
          {/* Admin Dashboard button (desktop) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
            >
              {t('Admin Dashboard')}
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/patient"
              className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
            >
              {t('Patients Details')}
            </Link>
          )}
          <button
            onClick={toggleLang}
            className="bg-gray-200 text-blue-700 px-4 py-2 rounded-full hover:bg-gray-300 transition font-semibold"
            style={{ minWidth: 80 }}
          >
            {lang === "en" ? t('Arabic') : t('English')}
          </button>
          <a
            href="#about"
            className="hover:text-blue-500 transition"
            onClick={(e) => handleSmoothScroll(e, "about")}
          >
            {t('About')}
          </a>
          <a
            href="#services"
            className="hover:text-blue-500 transition"
            onClick={(e) => handleSmoothScroll(e, "services")}
          >
            {t('Services')}
          </a>
          <a
            href="#contact"
            className="hover:text-blue-500 transition"
            onClick={(e) => handleSmoothScroll(e, "contact")}
          >
            {t('Contact Us')}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center text-blue-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-inner">
          <div className="flex flex-col items-center space-y-4 py-4 text-blue-700 font-medium">
            <Link
              to="/reservation"
              className="bg-blue-600 text-white px-4 py-2 rounded-full w-4/5 text-center"
              onClick={() => setIsOpen(false)}
            >
              {t('Book Appointment')}
            </Link>
            {/* Admin Dashboard button (mobile) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-gray-800 text-white px-4 py-2 rounded-full w-4/5 text-center"
                onClick={() => setIsOpen(false)}
              >
                {t('Admin Dashboard')}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/patient"
                className="bg-gray-800 text-white px-4 py-2 rounded-full w-4/5 text-center"
                onClick={() => setIsOpen(false)}
              >
                {t('Patients Details')}
              </Link>
            )}
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, "about")}
              className="hover:text-blue-500"
            >
              {t('About')}
            </a>
            <a
              href="#services"
              onClick={(e) => handleSmoothScroll(e, "services")}
              className="hover:text-blue-500"
            >
              {t('Services')}
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className="hover:text-blue-500"
            >
              {t('Contact Us')}
            </a>
            <button
              onClick={toggleLang}
              className="bg-gray-200 text-blue-700 px-4 py-2 rounded-full w-4/5 text-center font-semibold"
              style={{ minWidth: 80 }}
            >
              {lang === "en" ? t('Arabic') : t('English')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
