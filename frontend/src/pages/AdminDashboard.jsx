import React, { useState } from "react";
import { Calendar, Edit, Trash2, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';

const AdminDashboard = ({
  appointments,
  editingAppointment,
  editData,
  availableDates,
  timeSlots,
  startEdit,
  saveEdit,
  cancelEdit,
  deleteAppointment,
  setEditData,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isTimeSlotTaken = (date, time, currentId) => {
    return appointments.some(
      (apt) => apt.date === date && apt.time === time && apt._id !== currentId
    );
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointment(appointmentToDelete._id);
    }
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  const handleSave = () => {
    if (isTimeSlotTaken(editData.date, editData.time, editingAppointment)) {
      alert(
        `🚫 Sorry, ${new Date(editData.date).toLocaleDateString()} at ${
          editData.time
        } is already booked. Please choose another time.`
      );
      return;
    }
    saveEdit();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/signin");
  };

  const filteredAppointments = appointments.filter((apt) =>
    apt.mobile.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {t('Admin Dashboard')}
            </h2>
            <div className="flex gap-4 items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                {t('← Back to Home')}
              </Link>
              
            <Link
              to="/patient"
              className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
            >
              Patients Details
            </Link>
          
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                {t('Logout')}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={t('Search by mobile number...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('All Appointments')} ({filteredAppointments.length})
            </h3>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-500">{t('No appointments found.')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {t('Name')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {t('Mobile')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {t('Date')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {t('Time')}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {t('Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {editingAppointment === appointment._id ? (
                          <input
                            type="text"
                            value={editData.fullName}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        ) : (
                          appointment.fullName
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingAppointment === appointment._id ? (
                          <input
                            type="tel"
                            value={editData.mobile}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                mobile: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        ) : (
                          appointment.mobile
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingAppointment === appointment._id ? (
                          <select
                            value={editData.date}
                            onChange={(e) =>
                              setEditData({ ...editData, date: e.target.value })
                            }
                            className="w-full px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          >
                            {availableDates.map((date) => (
                              <option key={date} value={date}>
                                {new Date(date).toLocaleDateString()}
                              </option>
                            ))}
                          </select>
                        ) : (
                          new Date(appointment.date).toLocaleDateString()
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingAppointment === appointment._id ? (
                          <select
                            value={editData.time}
                            onChange={(e) =>
                              setEditData({ ...editData, time: e.target.value })
                            }
                            className="w-full px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          >
                            {timeSlots.map((time) => {
                              const taken = isTimeSlotTaken(
                                editData.date,
                                time,
                                editingAppointment
                              );
                              return (
                                <option
                                  key={time}
                                  value={time}
                                  disabled={taken}
                                >
                                  {time} {taken ? t('Booked') : ""}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          appointment.time
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingAppointment === appointment._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSave}
                              className="text-green-600 hover:text-green-800"
                              title={t('Save')}
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-800"
                              title={t('Cancel')}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(appointment)}
                              className="text-blue-600 hover:text-blue-800"
                              title={t('Edit')}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(appointment)}
                              className="text-red-600 hover:text-red-800"
                              title={t('Delete')}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t('Are you sure?')}
            </h3>
            <p className="text-gray-600 mb-6">{t('Delete this appointment?')}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {t('Delete')}
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold"
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
