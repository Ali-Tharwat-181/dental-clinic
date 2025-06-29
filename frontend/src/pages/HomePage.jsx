import React from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from 'react-i18next';

const services = [
  { name: "General Dentistry", img: "https://via.placeholder.com/150" },
  { name: "Teeth Cleaning", img: "https://via.placeholder.com/150" },
  { name: "Root Canal Treatment", img: "https://via.placeholder.com/150" },
  { name: "Dental Implants", img: "https://via.placeholder.com/150" },
  { name: "Orthodontics", img: "https://via.placeholder.com/150" },
  { name: "Cosmetic Dentistry", img: "https://via.placeholder.com/150" },
];

const photoPairs = [
  {
    id: 1,
    beforeImage: "https://picsum.photos/800/450?random=1",
    afterImage: "https://picsum.photos/800/450?random=2",
    altText: "Before and after comparison 1",
  },
  {
    id: 2,
    beforeImage: "https://picsum.photos/800/450?random=3",
    afterImage: "https://picsum.photos/800/450?random=4",
    altText: "Before and after comparison 2",
  },
  {
    id: 3,
    beforeImage: "https://picsum.photos/800/450?random=5",
    afterImage: "https://picsum.photos/800/450?random=6",
    altText: "Before and after comparison 3",
  },
];

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white mt-24">
        {/* Hero Section */}
        <section id="hero" className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-extrabold text-blue-900 mb-4">
            {t('Your Smile is Our Priority')}
          </h2>
          <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
            {t('Modern dental care and compassionate service to help you achieve a brighter, healthier smile.')}
          </p>
          <Link
            to="/reservation"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-xl"
          >
            {t('Book Appointment')}
          </Link>
        </section>
        {/* Services Section */}
        <section id="services" className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-blue-900 mb-10">
              {t('Our Services')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition"
                >
                  <img
                    src={service.img}
                    alt={t(service.name)}
                    className="w-24 h-24 object-cover mx-auto mb-4 rounded-full"
                  />
                  <h4 className="text-xl font-semibold text-blue-800">
                    {t(service.name)}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Gallery Section */}
        <section id="gallery" className="bg-blue-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-blue-900 mb-10">
              {t('Before & After')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photoPairs.map((pair) => (
                <figure
                  key={pair.id}
                  className="relative group shadow-md rounded-xl overflow-hidden"
                >
                  <img
                    src={pair.beforeImage}
                    alt={t('Before - {{altText}}', { altText: pair.altText })}
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={pair.afterImage}
                    alt={t('After - {{altText}}', { altText: pair.altText })}
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
        {/* About Us Section */}
        <section id="about" className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-blue-900 mb-6">{t('About Us')}</h3>
            <p className="text-lg text-blue-800 mb-4">
              {t('Ever Care Dental Clinic is dedicated to providing top-quality dental care using the latest technology and gentle service. Our team is here to help you maintain a healthy and beautiful smile.')}
            </p>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="bg-blue-50 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-blue-900 mb-6">{t('Contact Us')}</h3>
            <div className="space-y-4 text-blue-800 text-lg">
              <a
                href="tel:+201555675288"
                className="hover:text-blue-600 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPhone} /> +20 155 567 5288
              </a>
              <a
                href="mailto:evercareclinic1@gmail.com"
                className="hover:text-blue-600 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faEnvelope} /> evercareclinic1@gmail.com
              </a>
              <a
                href="https://maps.app.goo.gl/BwTrxJnaiJ2Mw5S18"
                className="hover:text-blue-600 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Al Dirasat Street 44, Dakahlia
              </a>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-blue-900 text-white py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <span>
              &copy; {new Date().getFullYear()} Ever Care Dental Clinic. {t('All rights reserved.')}
            </span>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                className="hover:text-blue-300"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a
                href="https://wa.me/201555675288"
                className="hover:text-green-400"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-pink-400"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
