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

export const sendVerificationMail = async (mailAddress, verificationCode) => {
    await redisClient.set(mailAddress, verificationCode, "EX", 60 * 5);
    const mailPayload = {
        from: process.env.ZOHO_USER, 
        to: mailAddress,
        subject: "[개발로그] 패스워드 변경 안내",
        text: "안녕하세요 닉네임님,\n" + 
            `요청하신 인증번호는 ${verificationCode} 입니다.\n\n` +
            "인증번호는 메일이 발송된 시점부터 5분만 유효합니다." +
            "조금 불편하시더라도 닉네임님의 소중한 개인정보를 위해 5분 안에 비밀번호 재설정을 부탁드립니다.\n\n" +
            "개발로그 드림."
    };
    return await transporter.sendMail(mailPayload);
}