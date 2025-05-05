import express from "express";
import doctorController from "../controllers/DoctorController.js";

const router = express.Router();


router.route("/")
.get(doctorController.getDoctor)

router.route("/:id")
.put(doctorController.updateDoctor)
.delete(doctorController.deleteDoctor)

export default router