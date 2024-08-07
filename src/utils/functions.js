export const generateCode = (length) => {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        result += chars.charAt(index);
    }

    return result;
}

export const generateResetToken = () => {
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return token.toString();
}

export const checkDocs = (user) => {
    if(user.rol === "admin"){
        return true
    }

    if(user.documents.length === 3){
        return true
    }

    return false
}