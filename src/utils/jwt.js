import jwt from 'jsonwebtoken';

export default (user) => {
    const privateKey = process.env.PRIVATE_KEY;
    const accessToken = jwt.sign({ user_id: user.user_id }, privateKey, {
        algorithm: "RS512",
        expiresIn: '30m' 
    });
    const refreshToken = jwt.sign({}, privateKey, {
        algorithm: "RS512",
        expiresIn: "14d"
    });

    return { accessToken, refreshToken };
}