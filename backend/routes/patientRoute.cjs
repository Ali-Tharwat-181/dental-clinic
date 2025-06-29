const express = require("express");
const controller = require("../controllers/patientController.cjs");
const router = express.Router();

router.post("/", controller.createPatient);
router.get("/", controller.getPatients);
router.get("/:id", controller.getPatientById);
router.put("/:id", controller.updatePatient);
router.delete("/:id", controller.deletePatient);

module.exports = router;
