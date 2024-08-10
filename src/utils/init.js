//Modules
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { errorHandler } from "../middleware/error.js";
import "../config/db.config.js";
import "../config/config.js";
import initializePassport from "../config/passport.config.js";
import addLogger from "./logger.js";
import configObject from "../config/config.js";

export const app = express();
export const PORT = 8080;

const { session_secret, mongo_url } = configObject;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: 'https://punisports.vercel.app',
    credentials: true
}));
app.use(errorHandler);

app.use("*/css", express.static("./src/public/css"));
app.use("*/js", express.static("./src/public/js"));

app.use(session({
    secret: session_secret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongo_url,
        ttl: 100000
    })
}));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use(addLogger);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Manejar errores de Multer
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Manejar otros errores
        return res.status(500).json({ message: err.message });
    }
    next();
});

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del Ecommerce de Ribot", 
            description: "App para venta de productos al por menor"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Listen server
const httpServer = app.listen(PORT, () => {
    console.log(`Abri el navegador en http://localhost:${PORT}`);
});