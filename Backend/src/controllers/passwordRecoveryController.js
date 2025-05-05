import jsonwebToken, { decode } from "jsonwebtoken" // token 
import bcrypt from "bcryptjs" //Encriptar contraseña

import clientsModel from "../models/Clients.js";
import employeeModel from "../models/Employees.js";
import { sendEmail, HTMLRecoveryEmail } from "../../utils/mailPasswordRecovery.js";
import { config } from "../../config.js";


//1- Crear un array de funciones
const passwordRecoveryController= {};

passwordRecoveryController.requestCode = async (req,res) => {

    const {email} = req.body;

    try {
        let userFound;
        let userType;

        userFound = await clientsModel.findOne({email})
if(userFound) {
    userType = "client"
} else {
    userFound = await employeeModel.findOne({email});
    userType = "Employee"
}
if(!userFound){
    return res.json ({message: "User not found}"})
}
    
//Generar un código de 6 digitos

const code = Math.floor(10000 + Math.random() * 60000).toString()

//generar un token
const token = jsonwebToken.sign(
    //1- ¿Qué voy a guardar?
    {
        email,
        code,
        userType,
        verified:false         
    },
    //2- secret key
    config.JWT.secret,
    //3 ¿Cuándo expira?
    {expiresIn: "25m"}
);

res.cookie("tokenRecoveryCode", token, { maxAge: 25 * 60 * 1000 });
 
// Enviamos el correo
await sendEmail(
  email,
  "Password recovery Code",
  `your verification code is ${code}`,
  HTMLRecoveryEmail(code)
);

res.json ({message: "verification code sent"});

    } catch (error) {
        console.log("error" + error)
    }
};

passwordRecoveryController.verifyCode = async (req,res) =>{

    const {code} = req.body;
    try {
        const token = req.cookies.tokenRecoveryCode;

        const decoded = jsonwebToken.verify(token, config.JWT.secret)

        if (decoded.code !==code){
            return res.json ({message: "Invalid Code"});
        }
        const newToken =jsonwebToken.sign(
        //1-que vamos a guardar

          {  email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified:true},
                //2-secret key
                config.JWT.secret,
        //3-¿Cuando vence?
              {expiresIn:"25m"}

        )
        res.cookie("tokenRecoveryCode", newToken, {maxAge:25*60*1000});
 
        res.json({ message: "Code verified successfully"});
       
    } catch (error) {
        console.log("error" + error)
    }
};

passwordRecoveryController.newPassword = async(req,res) =>{

    const {newPassword}= req.body;
    try {
                //decodificar el token

        const token = req.cookies.tokenRecoveryCode

        const decoded = jsonwebToken.verify(token, config.JWT.secret)

        if (!decoded.verified){
            return res.json ({message: "Code not verified"});
        }
let user;

const {email}= decoded;


const hashedPassword = await bcrypt.hash(newPassword,10)

//Guardamos la nueva contraseña en la base de datos

if( decoded.userType == "client"){
    user = await clientsModel.findOneAndUpdate(
        {email},
        {password:hashedPassword},
        {new: true}
    )
} else if (decoded.userType ="employee"){
    user = await employeeModel.findOneAndUpdate(
        {email},
        {password: hashedPassword},
        {new:true}
        )
}
res.clearCookie("tokenRecoveryCode") 
res.json ({message:"Password updated"})
        
    } catch (error) {
        console.log("error" + error)
    }
}
export default passwordRecoveryController