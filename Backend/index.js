//Importar el archivo app.js
import app from "./app.js";
import "./database.js";
import { config } from "./src/config.js";
//Creo una función que se encarga de 
//Ejecutar el servidor

async function main(){
    //crear una constante del puerto paso 1
    app.listen(config.server.port);
    console.log("Server is running " + config.server.port); }

    main();