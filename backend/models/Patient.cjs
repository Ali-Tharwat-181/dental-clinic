const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
