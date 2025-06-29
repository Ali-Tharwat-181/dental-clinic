import React from "react";
import { Calendar, Clock, Phone, User, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from 'react-i18next';

const ReservationPage = ({
  formData,
  setFormData,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  availableDates,
  timeSlots,
  isTimeSlotAvailable,
  handleSubmit,
  showConfirmation,
  setShowConfirmation,
}) => {
  const { t } = useTranslation();
  const isFullNameValid = /^[A-Za-z\s]{6,}$/.test(formData.fullName.trim());
  const isMobileValid = /^010\d{8}$/.test(formData.mobile);

  return (
    <main className="min-h-screen bg-blue-50 pt-24 pb-10">
      <section className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 mb-6 flex items-center font-medium"
          >
            {t('← Back to Home')}
          </Link>

          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            {t('Book Your Appointment')}
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-900">
                <User size={16} className="inline mr-2" />
                {t('Full Name')}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder={t('Enter your full name')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  !isFullNameValid && formData.fullName
                    ? "border-red-500"
                    : "border-blue-200"
                }`}
              />
              {!isFullNameValid && formData.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {t('Full name must be at least 6 characters.')}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-900">
                <Phone size={16} className="inline mr-2" />
                {t('Mobile Number (WhatsApp)')}
              </label>
              <div className="flex">
                <span className="px-3 py-3 bg-blue-100 border border-blue-200 border-r-0 rounded-l-lg text-blue-600 font-medium select-none">
                  +2
                </span>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value.replace(/\D/g, "").slice(0, 11),
                    })
                  }
                  placeholder={t('010xxxxxxxxx')}
                  className={`w-full px-4 py-3 border border-blue-200 border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    !isMobileValid && formData.mobile ? "border-red-500" : ""
                  }`}
                />
              </div>
              {!isMobileValid && formData.mobile && (
                <p className="text-red-500 text-xs mt-1">
                  {t('Mobile must start with 010 and be 11 digits.')}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-900">
                <Calendar size={16} className="inline mr-2" />
                {t('Select Date')}
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">{t('Choose a date')}</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Time */}
            {selectedDate && (
              <div>
                <label className="block mb-2 text-sm font-medium text-blue-900">
                  <Clock size={16} className="inline mr-2" />
                  {t('Select Time')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const isAvailable = isTimeSlotAvailable(selectedDate, time);
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={!isAvailable}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                          selectedTime === time
                            ? "bg-blue-600 text-white"
                            : isAvailable
                            ? "bg-blue-50 text-blue-900 hover:bg-blue-100"
                            : "bg-blue-50 text-blue-200 cursor-not-allowed opacity-50"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={
                !(
                  isFullNameValid &&
                  isMobileValid &&
                  selectedDate &&
                  selectedTime
                )
              }
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition ${
                isFullNameValid && isMobileValid && selectedDate && selectedTime
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {t('Book Appointment')}
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full text-center shadow-xl">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              {t('Appointment Confirmed!')}
            </h3>
            <p className="text-blue-800 mb-6">
              {t('Your appointment has been successfully booked. A confirmation message was sent to your WhatsApp.')}
            </p>
            <Link
              to="/"
              onClick={() => setShowConfirmation(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              {t('Done')}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default ReservationPage;
