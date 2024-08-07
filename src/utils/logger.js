import winston from "winston";

import program from "./commander.js";

const { mode } = program.opts();

const configLevels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    color: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

const logger = winston.createLogger({
    levels: configLevels.level,
    transports: [
        new winston.transports.Console({
            level: mode === "desarrollo" ? "debug" : "info",
            format: winston.format.combine(winston.format.colorize({colors: configLevels.color}), winston.format.simple())
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
});

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

export default addLogger;