import mongoose from "mongoose";
import {config} from "./src/config.js"
//Guardo en una constante la direcciónd e mi base d edatos


//Conectar la base de datos
mongoose.connect(config.db.URI)

//--------Comprobación que la base sirve

const connection = mongoose.connection; //Esta línea de código va a mostrar un true y un false lo cual permite saber si la conexión fallo o no

connection.once("open",  () =>
    {console.log("DB IS CONNECTED");   
    });

connection.on("disconnected", () =>
    {console.log("DB IS DISCONECTED");
    });

connection.once("error", (error) =>  
    {console.log("ERROR FOUND" + error);
    });

    //Aquí se puede poner si la conexión esta abierta, desconectada y dio error 