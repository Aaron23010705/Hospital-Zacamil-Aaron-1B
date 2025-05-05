import express from "express";

import cookieParser from "cookie-parser";
import registerDoctor from "./src/routes/registerDoctor.js"
import loginRoute from "./src/routes/login.js"
import DoctorRoute from "./src/routes/doctor.js"
import logoutRoute from "./src/routes/logout.js"
import passwordRoute from "./src/routes/passwordRecovery.js"



//creo una constante que es igual
//a la libreria que importe y se ejecuta
const app = express();
app.use(cookieParser())

//Uso un mmiddleware para que acepte datos jason
app.use (express.json());
//Definir la ruta
//Emboids, asi se llaman estas rutas

app.use("/api/registerDoctor", registerDoctor)
app.use("/api/Doctor", DoctorRoute)
app.use("/api/Login", loginRoute)
app.use("/api/Logout", logoutRoute)
app.use("/api/passwordRecovery", passwordRoute)



//Exporto la constante para poder usar express en otros lados
export default app;    
