import dotenv from "dotenv";
import program from "../utils/commander.js";

const options = program.opts();

dotenv.config({
    path: options.mode === "desarrollo" ? "./.env.desarrollo" : "./.env.produccion"
});

const configObject = {
    mongo_url: process.env.MONGO_URL,
    token_pass: process.env.TOKEN_PASS,
    cookie: process.env.COOKIE,
    gh_client_id: process.env.GH_CLIENT_ID,
    gh_client_secret: process.env.GH_CLIENT_SECRET,
    gh_callback_url: process.env.GH_CALLBACK_URL,
    session_secret: process.env.SESSION_SECRET
};

export default configObject;