import bcrypt from 'bcrypt';

export const createPassword = (plainText) => {
    try {
        const saltRounds = 10;
        return bcrypt.hashSync(plainText, bcrypt.genSaltSync(saltRounds));  
    } catch (err) {
        return {
            error: true,
            message: err
        }
    }
}