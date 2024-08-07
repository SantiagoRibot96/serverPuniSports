export const getErrorInfo = (box, type) => {

    switch (type) {
        case 1:
            return `Datos incompletos o no validos,
            Se estaperaba:
            - Name: String, pero se recibio ${box.first_name}
            - Lastname: String, pero se recibio ${box.last_name}
            - Email: String, pero se recibio ${box.email}`;

        case 2: 
            return `Datos incompletos o no validos,
            Se esperaba:
            - Title         : Needs to be a String, received ${box.title}
            - Description   : Needs to be a String, received ${box.description}
            - Price         : Needs to be a Number, received ${box.price}
            - Code          : Needs to be a String, received ${box.code}
            - Category      : Needs to be a String, received ${box.category}`;

        case 3:
            return `Producto ${box.title} (id: ${box._id}) no encontrado`;

        case 4:
            return `Codigo ${box.code} ya existe`;

        case 5:
            return `Error en la DB`;

        case 6: 
            return `Carrito id ${box.cid} no existe`

        default:
            return `Error no especificado`
    }
}