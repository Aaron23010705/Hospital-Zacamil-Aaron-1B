const DoctorController = {};

import DoctorModel from "../models/Doctor.js";

DoctorController.getDoctor = async (req,res) => {

    const Doctor = await DoctorModel.find();
    res.json(Doctor)
   
}

DoctorController.updateDoctor = async (req,res) => {
    const {name, speciality, email, password, isVerified} = req.body;
     const updatedDoctor = await DoctorModel.findByIdAndUpdate(req.params.id,{name, speciality, email, password, isVerified},{new:true})
     res.json ({message: "Doctor updated"});

}

DoctorController.deleteDoctor = async (req,res) => {

    await DoctorModel.findByIdAndDelete(req.params.id);
    res.json ({message: "Doctor deleted"});

}

export default DoctorController;