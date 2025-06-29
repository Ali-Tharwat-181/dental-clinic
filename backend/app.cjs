require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const appointmentRouter = require("./routes/appointments.cjs");
const authRouter = require("./routes/authRoute.cjs");
const patientRouter = require("./routes/patientRoute.cjs");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected to MongoDB"));

app.use("/api/appointments", appointmentRouter);
app.use("/api/auth", authRouter);
app.use("/api/patients", patientRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
