
import express from "express";
import registerDoctor from "../controllers/registerDoctorController.js"
const router = express.Router();


router.route("/").post(registerDoctor.register)
router.route("/verifyCodeEmail").post(registerDoctor.verifyCodeEmail);



export default router