import jsonwebtoken from "jsonwebtoken";//Token
import bcrypt from "bcryptjs"; //encriptar
import nodemailer from "nodemailer"; //enviar correo
import crypto from "crypto"; // código aleatorio

import DoctorModel from "../../models/Doctor.js"
import { config } from "../../config.js"; //config se pone en llave por que hay dos formas de exportar, cuando la exportamos por default que se puede exportar de cualquier manera y
// por constante, que en el caso de config es por constante y se tiene que mandar a llamar tal contaste

//Creamos un array de funciones

const registerDoctorController = {};

registerDoctorController.register = async (req,res) => {

    //1- Solicitas las cosas que vamos a guardar
    const {name, speciality, email, password, isVerified} = req.body;

    try {
        //Verificamos si el cliente ya existe
        const doesClientExist = await DoctorModel.findOne({email}); //Se busca el empleado por el email

        if (doesClientExist) {

            return res.json({message : "Patient already exists"})
        
    }
    //Encriptamos la contraseña


    const passwordHash = await bcrypt.hash(password, 10);

    //Guardo al cliente en la base de datos
    const newDoctor = new DoctorModel({name, 
        speciality,
        email, 
        password: passwordHash, 
        isVerified: isVerified || false, /*Aqui indicamos que isVerified SIEMPRE sera false al principio*/
    
    });
    await newDoctor.save();

    //Generamos un código aleatorio
    const verificationCode = crypto.randomBytes(3).toString("hex") //aquí creamos el código aleatorio, y con .toString("hex") nos aseguramos que el código siempre tenga letras y números

    //Creamos el token, el cual va a validar si ya se inició sesión
 
    const tokenCode = jsonwebtoken.sign(
        //1- ¿Qué vamos a guardar
{email, verificationCode},
//2- Palabra secreta
config.JWT.secret,
//3- cuando expira el token
{expiresIn: "2H"}
    )
    //4- Funcion flecha
res.cookie("VerificationToken", tokenCode, {maxAge: 2*60*60*1000}) //esos números significa que solo durará 2 horas la cookie

//Enviar el correo electrónico
/* Correos 
1-Transporter => ¿Quién lo envia?
2- mailOptions => ¿Quién lo recibe?
3-Envio
*/
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: config.userEmail.email_user,
        pass: config.userEmail.password_user
    }
});

//2-Mail opton => ¿Quién lo recibe?
const mailOptions = {

    //¿Quién lo envia?
    from: config.userEmail.email_user,
    //¿Quién lo recibe?
    to: email,
    //Asunto
    subject: "Verificación de correo",
    //Cuerpo del correo
    text:`Para verificar el correo utiliza el siguiente código :   ${verificationCode}
     \n el código vencerá en 2 horas`
}

//3 -Enviar el correo
transporter.sendMail(mailOptions, (error,info) => {
    if(error) return res.json({message: "Error"})
        console.log("Correo enviado" + info.response /* Info es para enviar un mensaje de confirmación que si se envió el correo */)
})

res.json({message: "Doctor registered. please verify your email with the code sent"})
} 
catch (error) {
        res.json ({message: "Eror" + error})
    }
};

//Verificar el código

registerDoctorController.verifyCodeEmail = async (req, res) => {

const {verificationCode} = req.body;

//Obtengo el token que contiene el código de verificación
const token =req.cookies.VerificationToken;

try {
//Verificar y decodificar el token
const decoded = jsonwebtoken.verify(token, config.JWT.secret)
const {email, verificationCode: storedCode} = decoded

//Comparar el código que se mando en el correo con el que el usuario escribe
if(verificationCode !== storedCode){
    return res.json ({message: "Invalid code"})

}

//Cambiamos el estado de "isVerified" a true
const   Patient = await patientsModel.findOne({email});
Patient.isVerified = true;
    await Patient.save()
    res.json({message: "Email verified"});

    //Se quita la cookie con el token
    res.clearCookie("VerificationToken");

}
catch(error) {
res.json ({message: "error"})
}


}

export default registerDoctorController