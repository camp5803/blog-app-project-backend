import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import crypto from 'crypto';
import { redisCli as redisClient } from '@/utils';

const mailgunOptions = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}
const transporter = nodemailer.createTransport(mailgunTransport(mailgunOptions));

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
        from: '', to,
        subject: "테스트용 메일이에용",
        text: `5분뒤에 만료될거임 ${verificationCode}`
    };
    return await transporter.sendMail(mailPayload);
}