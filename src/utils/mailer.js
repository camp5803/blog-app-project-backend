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

export const sendVerificationMail = async (mailAddress, nickname, verificationCode) => {
    await redisClient.set(mailAddress, verificationCode, "EX", 60 * 5);
    const mailPayload = {
        from: process.env.ZOHO_USER,
        to: mailAddress,
        subject: "[개발로그] 패스워드 변경 안내",
        html: `
            <html>
                <body>
                    <h2>안녕하세요 ${nickname}님,</h2><br/>
                    <p>요청하신 인증번호는 <strong>${verificationCode}</strong> 입니다.</p></br>
                    <p>인증번호는 메일이 발송된 시점부터 5분만 유효합니다.</p>
                    <p>조금 불편하시더라도 ${nickname}님의 소중한 개인정보를 위해 5분 안에 비밀번호 재설정을 부탁드립니다.</p><br/>
                    <p>개발로그 드림.</p>
                </body>
            </html>
        `,
    };
    return await transporter.sendMail(mailPayload);
}