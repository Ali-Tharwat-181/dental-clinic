const Appointment = require("../models/Appointment.cjs");
const { sendWhatsAppMessage } = require("../services/whatsappService.cjs");

exports.createAppointment = async (req, res) => {
  try {
    console.log("Received body:", req.body); // Log incoming data
    const { fullName, mobile, date, time, notes, patientMobile } = req.body;
    const appointment = await Appointment.create({
      fullName,
      mobile,
      date,
      time,
      notes,
      patientMobile: patientMobile || mobile,
    });

    // Send WhatsApp confirmation
    await sendWhatsAppMessage(mobile, fullName, date, time);

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Error in createAppointment:", err); // Log error details
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
};

exports.deleteAppointment = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

exports.updateAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(appointment);
};

exports.getAppointmentsByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;
    const appointments = await Appointment.find({ patientMobile: mobile });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
