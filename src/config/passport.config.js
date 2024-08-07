import passport from "passport";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

import UserService from "../services/users.services.js";
import configObject from "./config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const userService = new UserService();
const { gh_client_id, gh_client_secret, gh_callback_url, token_pass, cookie } = configObject;

const initializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: gh_client_id,
        clientSecret: gh_client_secret,
        callbackURL: gh_callback_url
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = {
                first_name: profile._json.name,
                last_name: " ",
                email: profile._json.email,
                password: "imposibleDeHackear",
                age: 36
            }
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: token_pass,

    }, async (jwt_payload, done) => {
        try {
            const user = await userService.findUser(jwt_payload.email);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}

const cookieExtractor = (req) => {
    let token = null;

    if(req && req.cookies) {
        token = req.cookies[cookie];
    }
    
    return token;
}

export default initializePassport;