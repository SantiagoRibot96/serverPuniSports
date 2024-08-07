import { Command } from "commander";

const program = new Command();

program
    .option("-p <port>", "Puerto donde se inicia el servidor", 8080)//Comando, descripcion, valor por default
    .option("--mode <mode>", "Modo de trabajo", "produccion")
program.parse();

export default program