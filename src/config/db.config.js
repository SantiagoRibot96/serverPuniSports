import mongoose from "mongoose";
import configObject from "./config.js";

const { mongo_url } = configObject;

mongoose.connect(mongo_url)
    .then(() => console.log("Conexion con MongoDB exitosa"))
    .catch((error) => console.log("Error en la conexion: ", error));