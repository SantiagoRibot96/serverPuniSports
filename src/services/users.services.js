import UserModel from "../models/user.model.js";
import CartService from "./carts.services.js";
import jwt from "jsonwebtoken";

import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import configObject from "../config/config.js";

const { token_pass } = configObject;
const cartService = new CartService();

class UserService {
    async deleteUser(email) {
        try {
            const user = await UserModel.findByIdAndDelete({email});
            if(!user) throw new Error("No se encontro al usuario");
            return (user)
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async getUsers() {
        try {
            const users = await UserModel.find();
            if(!users) throw new Error("No se encontraron usuarios");
            return (users)
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
    
    async registerUser(first_name, last_name, email, password, age) {
        try {
            let user = await UserModel.findOne({email});
    
            if(user) throw new Error("El usuario ya existe");
    
            const cart = await cartService.addCart(email);
    
            let newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                age,
                cart: cart._id
            }
    
            user = await UserModel.create(newUser);
            
            const token = jwt.sign({email}, token_pass, {expiresIn: "1h"});

            await UserModel.findByIdAndUpdate(user._id, {last_connection: new Date()});

            return {token, user};
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async validateUser(email, password) {
        try {
            const user = await UserModel.findOne({email});
    
            if(!user) throw new Error("El usuario no existe");
    
            if(!isValidPassword(password, user)) throw new Error("Usuario y contraseña no coinciden");
    
            const token = jwt.sign({email}, token_pass, {expiresIn: "1h"});

            await UserModel.findByIdAndUpdate(user._id, {last_connection: new Date()});

            return {token, user};
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async findUser(email) {
        try {
            const user = await UserModel.findOne({email});

            return user;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async updateDocs(uid, doc){
        try {
            const user = await UserModel.findById(uid);

            const docsArray = user.documents;
            docsArray.push(doc);
            await UserModel.findByIdAndUpdate(uid, {documents: docsArray});
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async updateRol(uid, rol) {
        try {
            const actualizado = await UserModel.findByIdAndUpdate(uid, { rol: rol }, { new: true });
            return actualizado;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}

export default UserService;