const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "confirmed" },
  notes: { type: String },
  patientMobile: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
