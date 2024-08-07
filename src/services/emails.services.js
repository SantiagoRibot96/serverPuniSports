import nodemailer from "nodemailer";

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "ribotsantiago@gmail.com",
                pass: "kpxd npvt uxgm vduu"
            }
        });
    }

    async enviarCorreoDocs(email, docs){
        try {
            const mailOptions = {
                from: "PuniSports <ribotsantiago@gmail.com>",
                to: email,
                subject: 'Confirmación de documentacion',
                html: `
                    <h1>Se ha subido la documentacion correctamente</h1>
                    <p>${docs[0].name} - ${docs[1].name} - ${docs[2].name}</p>
                    <p>Esta todo preparado para que asciendas a premium</p>
                    <p>Contactate con el admin para hacerlo</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }

    async enviarCorreoRol(email, first_name, rol) {
        try {
            const mailOptions = {
                from: "PuniSports <ribotsantiago@gmail.com>",
                to: email,
                subject: 'Confirmación de cambio de rol',
                html: `
                    <h1>Confirmación de cambio de rol</h1>
                    <p>${first_name}, se te ha cambiado el rol a ${rol}</p>
                    <p>En caso de ser un error, por favor contactese con el admin</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }

    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "PuniSports <ribotsantiago@gmail.com>",
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket.code}</p>
                    <p>El total de la compra es: $${ticket.amount}.-</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            const mailOptions = {
                from: "PuniSports <ribotsantiago@gmail.com>",
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="https://punisports.vercel.app/reset-password/${email}">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
}

export default EmailManager;