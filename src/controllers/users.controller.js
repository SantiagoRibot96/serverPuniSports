import UserService from "../services/users.services.js";
import configObject from "../config/config.js";
import EmailManager from "../services/emails.services.js";
import path from 'path';

import { isValidPassword, createHash } from "../utils/hashbcrypt.js";
import { generateResetToken, checkDocs } from "../utils/functions.js";

const emailManager = new EmailManager();
const { cookie } = configObject;
const userService = new UserService();

class UserController {
    async deleteUser(req, res) {
        const { email } = req.body;
        try {
            const user = await userService.deleteUser(email);
            res.status(200).send({ok: true, message: "Usuario borrado", payload: user});
        } catch (error) {
            req.logger.error(`No se encontraron usuarios: ${error}`);
            res.status(500).send({ok: false, error: "Error interno del servidor"});
        }
    }

    async getUser(req, res) {
        try {
            const user = req.user;
            const usersDAO = {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                cart: user.cart,
                rol: user.rol, 
                last_connection: `${user.last_connection.getDate()}-${user.last_connection.getMonth()}-${user.last_connection.getFullYear()} -- ${user.last_connection.getHours()}:${user.last_connection.getMinutes()}`,
                documentOk: checkDocs(user)
            }

            res.status(200).send({ok: true, message: "Usuario obtenidos con exito", payload: usersDAO, isLogged: true});
        } catch (error) {
            req.logger.error(`No se encontraron usuarios: ${error}`);
            res.status(500).send({ok: false, error: "Error interno del servidor"});
        }
    }

    async getUsers(req, res) {
        try {
            const users = await userService.getUsers();
            const usersDAO = users.map(item => {
                const user = {
                    _id: item._id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    email: item.email,
                    age: item.age,
                    cart: item.cart,
                    rol: item.rol, 
                    last_connection: `${item.last_connection.getDate()}-${item.last_connection.getMonth()}-${item.last_connection.getFullYear()} -- ${item.last_connection.getHours()}:${item.last_connection.getMinutes()}`,
                    documentOk: checkDocs(item)
                }
                return user
            });

            res.status(200).send({ok: true, message: "Usuario obtenidos con exito", payload: usersDAO});
        } catch (error) {
            req.logger.error(`No se encontraron usuarios: ${error}`);
            res.status(500).send({ok: false, error: "Error interno del servidor"});
        }
    }

    async registerUser(req, res) {
        try {
            const {first_name, last_name, email, password, age} = req.body;

            const {token, user} = await userService.registerUser(first_name, last_name, email, password, age);
    
            res.cookie(cookie, token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: false
            });
    
            res.status(200).send({ok: true, message: "Usuario creado con exito", payload: user, isLogged: true});
        } catch (error) {
            req.logger.error(`No se pudo registrar el usuario: ${error}`);
        }
    }

    async validateUser(req, res) {
        try {
            const {email, password} = req.body;
            const {token, user} = await userService.validateUser(email, password);

            res.cookie(cookie, token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: false
            });
        
            res.status(200).send({ok: true, message: "Bienvenido", payload: user, isLogged: true});
        } catch (error) {
            req.logger.error(`No se pudo obtener el usuario: ${error}`);
            res.status(500).send({ok: false, error: `No se pudo obtener el usuario ${error}`, isLogged: false});
        }
    }

    async githubToken(req, res) {
        try {
            let token;
            let user;

            await userService.findUser(req.user.email) ? 
                {token, user} = await userService.validateUser(req.user.email, req.user.password):
                {token, user} = await userService.registerUser(req.user.first_name, req.user.last_name, req.user.email, req.user.password, req.user.age);

            res.cookie(cookie, token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: false
            });
        
            // res.status(200).send({ok: true, message: "Bienvenido usuario con Github", payload: user, isLogged: true});
            res.redirect("https://punisports.vercel.app/");
        } catch (error) {
            req.logger.error(`No se pudo generar el token: ${error}`);
        }
    }

    async logout(req, res) {
        res.clearCookie(cookie);
        res.status(200).send({ok: true, message: "Usuario deslogeado", isLogged: false});
    }

    async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const user = await userService.findUser(email);
            if (!user) {
                return res.status(404).send({ok: false, error: "Usuario no encontrado", isLogged: false});
            }

            const token = generateResetToken();

            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000)
            };

            await user.save();
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            res.status(200).send({ok: true, message: "Mensaje enviado", isLogged: false});
        } catch (error) {
            res.status(500).send({ok: false, error: "Error interno del servidor", isLogged: false});
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await userService.findUser(email);
            if (!user) {
                return res.status(404).send({ok: false, error: "Usuario no encontrado", isLogged: false});
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.status(400).send({ok: false, error: "Token invalido", isLogged: false});
            }

            const now = new Date();
            if (now > resetToken.expiresAt) {
                return res.status(400).send({ok: false, error: "Token expirado", isLogged: false});
            }

            if (isValidPassword(password, user)) {
                return res.status(400).send({ok: false, error: "La nueva contraseña debe ser distinta a la anterior", isLogged: false});
            }

            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();

            res.status(200).send({ok: true, message: "Password cambiada con exito", isLogged: false});
        } catch (error) {
            res.status(500).send("Error interno del servidor");
            next(error);
        }
    }

    async changeRol(req, res) {
        try {
            const { rol, umail } = req.params;
            const user = await userService.findUser(umail);
            const users = await userService.getUsers();
            const admins = users.filter(user => user.rol === "admin");

            if(admins.length === 1 && user.rol === "admin"){
                return res.status(400).send({ok: false, error: "Debe quedar al menos un admin", isLogged: true});
            }

            if(rol != "user" && rol != "premium" && rol != "admin") {
                return res.status(400).send({ok: false, error: "Rol no permitido", isLogged: true});
            }

            if (!user) {
                return res.status(404).send({ok: false, error: "Usuario no encontrado", isLogged: true});
            }
    
            const actualizado = await userService.updateRol(user._id, rol);
            emailManager.enviarCorreoRol(user.email, user.first_name, rol);
            res.status(200).send({ok: true, message: "Rol cambiado", payload: actualizado, isLogged: true});
        } catch (error) {
            res.status(500).send(`Error interno del servidor ${error}`);
        }
    }

    async uploadDocuments(req, res) {
        try {
            const { umail } = req.params;
            let user = await userService.findUser(umail);

            if(!user){
                return res.status(404).send({ok: false, message: "Usuario no encontrado", isLogged: false});
            }
                        
            const doc = req.files['document'] ? {
                name: req.files['document'][0].filename,
                reference: path.join('src/public/documents', req.files['document'][0].filename)
            } : null;
        
            const prod = req.files['product'] ? {
                name: req.files['product'][0].filename,
                reference: path.join('src/public/products', req.files['product'][0].filename)
            } : null;
        
            const prof = req.files['profile'] ? {
                name: req.files['profile'][0].filename,
                reference: path.join('src/public/profiles', req.files['profile'][0].filename)
            } : null;

            if (doc) await userService.updateDocs(user._id, doc);
            if (prod) await userService.updateDocs(user._id, prod);
            if (prof) await userService.updateDocs(user._id, prof);

            user = await userService.findUser(umail);
            emailManager.enviarCorreoDocs(user.email, user.documents);
            res.status(200).send({ok: true, message: "Documentacion subida correctamente", payload: user.documents, isLogged: true});
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Error interno del servidor`});
        }
    }
}

export default UserController;