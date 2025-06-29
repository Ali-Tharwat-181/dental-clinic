import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function PatientDetails() {
  const [form, setForm] = useState({ name: "", mobile: "", age: "" });
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      const data = await res.json();
      setPatients(data);
    } catch {
      setError("Failed to fetch patients");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation helpers
  const isNameValid = /^[A-Za-z\s]+$/.test(form.name.trim());
  const isMobileValid = /^010\d{8}$/.test(form.mobile);
  const isMobileUnique = !patients.some(
    (p) => p.mobile === form.mobile && p._id !== editingId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.mobile || !form.age) {
      setError("All fields are required");
      return;
    }
    if (!isNameValid) {
      setError("Name must contain only letters and spaces");
      return;
    }
    if (!isMobileValid) {
      setError("Mobile must start with 010 and be 11 digits");
      return;
    }
    if (!isMobileUnique) {
      setError("Mobile number already exists");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!res.ok) throw new Error("Failed to add patient");
      setForm({ name: "", mobile: "", age: "" });
      fetchPatients();
    } catch {
      setError("Failed to add patient");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: "DELETE",
      });
      fetchPatients();
    } catch {
      setError("Failed to delete patient");
    }
  };

  const startEdit = (patient) => {
    setEditingId(patient._id);
    setForm({ name: patient.name, mobile: patient.mobile, age: patient.age });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.mobile || !form.age) {
      setError("All fields are required");
      return;
    }
    if (!isNameValid) {
      setError("Name must contain only letters and spaces");
      return;
    }
    if (!isMobileValid) {
      setError("Mobile must start with 010 and be 11 digits");
      return;
    }
    if (!isMobileUnique) {
      setError("Mobile number already exists");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/patients/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, age: Number(form.age) }),
        }
      );
      if (!res.ok) throw new Error("Failed to update patient");
      setEditingId(null);
      setForm({ name: "", mobile: "", age: "" });
      fetchPatients();
    } catch {
      setError("Failed to update patient");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", mobile: "", age: "" });
  };

  // Search filter
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mobile.includes(search)
  );

  return (
    <div className="w-[80%] mx-auto py-10">
      <Link to="/" className="text-blue-600 hover:text-blue-800">
        {t("← Back to Home")}
      </Link>
      <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">
        {t("Patient Management")}
      </h2>
      <form
        onSubmit={editingId ? handleUpdate : handleSubmit}
        className="space-y-4 bg-white p-8 rounded-xl shadow-lg mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium text-blue-900">
              {t("Name")}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                form.name && !isNameValid ? "border-red-500" : ""
              }`}
              required
            />
            {form.name && !isNameValid && (
              <div className="text-red-500 text-xs mt-1">
                {t("Only letters and spaces allowed")}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">
              {t("Mobile")}
            </label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                form.mobile && (!isMobileValid || !isMobileUnique)
                  ? "border-red-500"
                  : ""
              }`}
              required
            />
            {form.mobile && !isMobileValid && (
              <div className="text-red-500 text-xs mt-1">
                {t("Must start with 010 and be 11 digits")}
              </div>
            )}
            {form.mobile && isMobileValid && !isMobileUnique && (
              <div className="text-red-500 text-xs mt-1">
                {t("Mobile number already exists")}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-blue-900">
              {t("Age")}
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              min="0"
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-center">{t(error)}</div>}
        <div className="flex gap-4 justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {editingId ? t("Update Patient") : t("Add Patient")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
            >
              {t("Cancel")}
            </button>
          )}
        </div>
      </form>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h3 className="text-xl font-semibold text-blue-800">
          {t("All Patients")}
        </h3>
        <input
          type="text"
          placeholder={t("Search by name or number...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-full md:w-64"
        />
      </div>
      <div className="overflow-x-auto rounded-xl shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t("No patients found.")}
          </div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-3 text-left">{t("Name")}</th>
                <th className="py-2 px-3 text-left">{t("Mobile")}</th>
                <th className="py-2 px-3 text-left">{t("Age")}</th>
                <th className="py-2 px-3 text-left">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p._id} className="border-t hover:bg-blue-50">
                  <td className="py-2 px-3 font-medium">{p.name}</td>
                  <td className="py-2 px-3">{p.mobile}</td>
                  <td className="py-2 px-3">{p.age}</td>
                  <td className="py-2 px-3 space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {t("Edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      {t("Delete")}
                    </button>
                    <Link
                      to={`/patients/${p._id}`}
                      className="text-green-600 hover:underline font-semibold"
                    >
                      {t("Details")}
                    </Link>
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
