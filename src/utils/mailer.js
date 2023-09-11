import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { redisCli as redisClient } from '@/utils';

const transporterOptions = {
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_APP_SECRET
    }
}
const transporter = nodemailer.createTransport(transporterOptions);

const generateRandomString = (length) => {
    let result = '';
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(crypto.randomInt(charset.length));
    }
    return result;
}

export const sendVerificationMail = async (mailAddress) => {
    const verificationCode = generateRandomString(6);
    await redisClient.set(mailAddress, verificationCode, "EX", 60 * 5);
    const mailPayload = {
        from: process.env.ZOHO_USER, 
        to: mailAddress,
        subject: "테스트용 메일이에용",
        text: `5분뒤에 만료될거임 ${verificationCode}`
    };
    return await transporter.sendMail(mailPayload);
}

(async function() {
    await sendVerificationMail("hickerd@sch.ac.kr");
})()