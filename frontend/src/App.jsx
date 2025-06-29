import React, { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import AdminDashboard from "./pages/AdminDashboard";
import SignInPage from "./pages/SignInPage";
import { Navigate, Route, Routes, useLocation } from "react-router";
import PatientDetails from "./pages/PatientDetails";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import { useTranslation } from 'react-i18next';

function RequireAdminAuth({ children }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/signin" state={{ from: location }} replace />;
  }
  return children;
}

const DentistReservationSystem = () => {
  const { i18n } = useTranslation();
  const dir = i18n.t('rtl');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getDefaultSelectedDate());
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editData, setEditData] = useState({});

  // Clinic static data

  // Generate available time slots (3:30 PM to 10:30 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 3; hour < 11; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // Get next 30 days for booking
  function getAvailableDates() {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Fridays (day 5)
      if (date.getDay() !== 5) {
        dates.push(date.toISOString().split("T")[0]);
      }
    }
    return dates;
  }
  const availableDates = getAvailableDates();

  // Set default selectedDate to today if not Friday, otherwise next available day
  function getDefaultSelectedDate() {
    const today = new Date();
    if (today.getDay() !== 5) {
      return today.toISOString().split("T")[0];
    } else {
      // Find the next available date
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 5) {
          return date.toISOString().split("T")[0];
        }
      }
    }
    return "";
  }

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(res.data);
      setError(null);
    } catch {
      setError("Failed to fetch appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Check if time slot is available
  const isTimeSlotAvailable = (date, time) => {
    return !appointments.some((apt) => apt.date === date && apt.time === time);
  };

  // Handle form submission (create appointment)
  const handleSubmit = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !formData.fullName ||
      !formData.mobile
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!isTimeSlotAvailable(selectedDate, selectedTime)) {
      alert("This time slot is no longer available");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/appointments", {
        ...formData,
        date: selectedDate,
        time: selectedTime,
      });
      setShowConfirmation(true);
      setFormData({ fullName: "", mobile: "" });
      setSelectedDate(getDefaultSelectedDate());
      setSelectedTime("");
      fetchAppointments();
    } catch {
      alert("Failed to book appointment");
    }
  };

  // Admin functions
  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      fetchAppointments();
    } catch {
      alert("Failed to delete appointment");
    }
  };

  const startEdit = (appointment) => {
    setEditingAppointment(appointment._id);
    setEditData({
      fullName: appointment.fullName,
      mobile: appointment.mobile,
      date: appointment.date,
      time: appointment.time,
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${editingAppointment}`,
        editData
      );
      setEditingAppointment(null);
      setEditData({});
      fetchAppointments();
    } catch {
      alert("Failed to update appointment");
    }
  };

  const cancelEdit = () => {
    setEditingAppointment(null);
    setEditData({});
  };

  // Main App Render with React Router
  return (
    <div dir={dir}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/reservation"
          element={
            <ReservationPage
              formData={formData}
              setFormData={setFormData}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              availableDates={availableDates}
              timeSlots={timeSlots}
              isTimeSlotAvailable={isTimeSlotAvailable}
              handleSubmit={handleSubmit}
              showConfirmation={showConfirmation}
              setShowConfirmation={setShowConfirmation}
            />
          }
        />
        <Route path="/admin/signin" element={<SignInPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <AdminDashboard
                appointments={appointments}
                editingAppointment={editingAppointment}
                editData={editData}
                availableDates={availableDates}
                timeSlots={timeSlots}
                startEdit={startEdit}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
                deleteAppointment={deleteAppointment}
                setEditData={setEditData}
                loading={loading}
                error={error}
              />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/patient"
          element={
            <RequireAdminAuth>
              <PatientDetails />
            </RequireAdminAuth>
          }
        />
        <Route path="/patients/:id" element={<RequireAdminAuth><PatientDetailsPage /></RequireAdminAuth>} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default DentistReservationSystem;
