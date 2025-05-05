/*
Como se va a validar si es cliente o empleado se importan ambos modelos
SE IMPORTAN TAMBIÉN LAS LIBRERIAS BYCRIPT, JSONWEBTOKEN Y el archivo config

*/

import DoctorModel from "../models/Doctor.js"
import bcrypt from "bcryptjs"
import jswonwebtoken from "jsonwebtoken"
import {config} from "../config.js"

const loginController = {};

loginController.login = async (req,res) => {

    const {email,password} = req.body;

    try {

        //Validamos los 3 posibles niveles

        //1 admin, 2, Empleado, 3, Cliente
     let userFound; //Valida si se encontro el usuario
     let userType; //Indica el tipo de usuario

     //1-Admin
     //Verifiquemos si quien esta ingresando es admin
     
     if(email === config.emailAdmin.email && password === config.emailAdmin.password) {

        userType = "Admin"
        userFound   ={_id:"Admin"}
     }else {

             //2- Empleado

        userFound = await DoctorModel.findOne({email})
        userType = "Doctor";

             //3- Cliente
     }

     if(!userFound){
        return res.json ({message: "User not found"})
     }

     //si no es administrador validamos la contraseña
     if(userType !== "Admin") {
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.json ({message: "invalid Password"})

        }
     }

     //Generar eltoken

     jswonwebtoken.sign(

        //1- Que se va a guardar
        {id: userFound._id, userType},
        //2 Clave secreta
        config.JWT.secret,
        //3-cuando expira
        {expiresIn: config.JWT.expiresIN},
        //4- Función flecha
        (error, token )=> {
        if (error) console.log(error)
            res.cookie("authToken", token)
            res.json({message: "login successful"})
        }
     )

    } catch(error) {

        console.log(error)
    }
}

export default loginController