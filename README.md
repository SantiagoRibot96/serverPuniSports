# Entregas de Ribot Santiago

1) `npm install`: Install all dependencies needed to run the project
2) `npm start`: This will start node app.js
3) There are two users created:
	- user@user.com: user with role User. Password: 1234
	- admin@admin.com: user with role Admin. Password: 1234
        - premium@premium.com: user with role Premium. Password: 1234

## Features:

- El usuario debe subir la documentacion solicitada para que el admin pueda ascenderlo a premium.
- Un usuario premium puede agregar productos.
- Un usuario premium puede elminiar y actualizar unicamente sus productos.
- Un usuario admin no puede ser eliminado.
- Un usuario admin puede agregar, actualizar y eliminar cualquier producto.
- Un usuario admin puede modificar los roles de cualquiera, pero no puede haber ningun admin.
- Al concretar la compra se envia un mail con los detalles
- Al cambiar un rol se envia un mail con los detalles

## Tecnologies:

- JavaScript
- Express
- Mongoose
- Sessions
- Login con passport
- Login con passport-github2
- Trabajo por capas
- Variables de entorno con dotenv
- Commander
- Hasheo de Pass con BCrypt
- Cookies
- Json Web Token
- Mailing
- Swagger
- Error handling with middlewares
- Error logging
- Multer