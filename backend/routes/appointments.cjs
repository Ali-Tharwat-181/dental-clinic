const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController.cjs");

router.post("/", controller.createAppointment);
router.get("/", controller.getAppointments);
router.delete("/:id", controller.deleteAppointment);
router.put("/:id", controller.updateAppointment);
router.get("/by-mobile/:mobile", controller.getAppointmentsByMobile);

module.exports = router;
