import nodemailer from 'nodemailer';
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

export const sendVerificationMail = async (mailAddress, randomStr) => {
    await redisClient.set(mailAddress, verificationCode, "EX", 60 * 5);
    const mailPayload = {
        from: process.env.ZOHO_USER, 
        to: mailAddress,
        subject: "[개발로그] 패스워드 변경 안내",
        text: `다음 6자 키워드를 홈페이지에 입력해주세용 ${randomStr}`
    };
    return await transporter.sendMail(mailPayload);
}