import bcrypt from 'bcrypt';

export const createPassword = (plainText) => {
    const saltRounds = 10;

    bcrypt.getSalt(saltRounds, (err, salt) => {
        if (err) throw new Error(err);
        bcrypt.hash(plainText, salt, (err, cipherText) => {
            if (err) throw new Error(err);
            return cipherText;
        })
    })
}