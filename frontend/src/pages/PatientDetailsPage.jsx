import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useTranslation } from 'react-i18next';

export default function PatientDetailsPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [success, setSuccess] = useState("");
  const [editingAptId, setEditingAptId] = useState(null);
  const [editAptData, setEditAptData] = useState({ date: "", time: "", notes: "" });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/patients/${id}`);
        if (!res.ok) throw new Error("Patient not found");
        const data = await res.json();
        setPatient(data);
      } catch {
        setError("Failed to fetch patient");
      }
      setLoading(false);
    };
    fetchPatient();
  }, [id]);

  useEffect(() => {
    if (patient && patient.mobile) {
      fetchAppointments(patient.mobile);
    }
  }, [patient]);

  const fetchAppointments = async (mobile) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/by-mobile/${mobile}`);
      const data = await res.json();
      setAppointments(data);
    } catch {
      setAppointments([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.date || !form.time) {
      setError("Date and time are required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: patient.name,
          mobile: patient.mobile,
          date: form.date,
          time: form.time,
          notes: form.notes,
          patientMobile: patient.mobile,
        }),
      });
      if (!res.ok) throw new Error("Failed to add appointment");
      setSuccess("Appointment and notes saved!");
      setForm({ date: "", time: "", notes: "" });
      fetchAppointments(patient.mobile);
    } catch {
      setError("Failed to save appointment");
    }
  };

  const startEditApt = (apt) => {
    setEditingAptId(apt._id);
    setEditAptData({ date: apt.date, time: apt.time, notes: apt.notes || "" });
  };

  const cancelEditApt = () => {
    setEditingAptId(null);
    setEditAptData({ date: "", time: "", notes: "" });
  };

  const handleEditAptChange = (e) => {
    setEditAptData({ ...editAptData, [e.target.name]: e.target.value });
  };

  const saveEditApt = async (aptId) => {
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${aptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAptData),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      setEditingAptId(null);
      setEditAptData({ date: "", time: "", notes: "" });
      fetchAppointments(patient.mobile);
    } catch {
      setError("Failed to update appointment");
    }
  };

  const deleteApt = async (aptId) => {
    if (!window.confirm("Delete this appointment?")) return;
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${aptId}`, {
        method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete appointment");
      fetchAppointments(patient.mobile);
    } catch {
      setError("Failed to delete appointment");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{t(error)}</div>;
  if (!patient) return null;

  return (
    <div className="w-[80%] mx-auto py-10">
      <Link to="/patient" className="text-blue-600 hover:underline">{t('← Back to Patients')}</Link>
      <h2 className="text-2xl font-bold mb-4 mt-4 text-blue-900">{t('Patient Details')}</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="mb-2"><span className="font-semibold text-blue-800">{t('Name')}:</span> {patient.name}</div>
        <div className="mb-2"><span className="font-semibold text-blue-800">{t('Mobile')}:</span> {patient.mobile}</div>
        <div className="mb-2"><span className="font-semibold text-blue-800">{t('Age')}:</span> {patient.age}</div>
        <div className="mb-2"><span className="font-semibold text-blue-800">ID:</span> {patient._id}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-blue-800">{t('Add Last Appointment & Notes')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow mb-8">
        <div>
          <label className="block mb-1 font-medium text-blue-900">{t('Date')}</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-blue-900">{t('Time')}</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-blue-900">{t('Notes')}</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={3}
            placeholder={t('Add any notes about this appointment...')}
          />
        </div>
        {error && <div className="text-red-500">{t(error)}</div>}
        {success && <div className="text-green-600">{t('Save Appointment')}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {t('Save Appointment')}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-2 text-blue-800">{t('Appointment History')}</h3>
      <div className="overflow-x-auto rounded-xl shadow">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{t('No appointments found.')}</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-3 text-left">{t('Date')}</th>
                <th className="py-2 px-3 text-left">{t('Time')}</th>
                <th className="py-2 px-3 text-left">{t('Notes')}</th>
                <th className="py-2 px-3 text-left">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id} className="border-t hover:bg-blue-50">
                  <td className="py-2 px-3">
                    {editingAptId === apt._id ? (
                      <input
                        type="date"
                        name="date"
                        value={editAptData.date}
                        onChange={handleEditAptChange}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      apt.date
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingAptId === apt._id ? (
                      <input
                        type="time"
                        name="time"
                        value={editAptData.time}
                        onChange={handleEditAptChange}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      apt.time
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {editingAptId === apt._id ? (
                      <input
                        type="text"
                        name="notes"
                        value={editAptData.notes}
                        onChange={handleEditAptChange}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      apt.notes || "-"
                    )}
                  </td>
                  <td className="py-2 px-3 space-x-2">
                    {editingAptId === apt._id ? (
                      <>
                        <button
                          onClick={() => saveEditApt(apt._id)}
                          className="text-green-600 hover:underline font-semibold"
                        >
                          {t('Save')}
                        </button>
                        <button
                          onClick={cancelEditApt}
                          className="text-gray-600 hover:underline font-semibold"
                        >
                          {t('Cancel')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditApt(apt)}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          {t('Edit')}
                        </button>
                        <button
                          onClick={() => deleteApt(apt._id)}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          {t('Delete')}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 