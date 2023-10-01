import request from 'supertest'
import { StatusCodes } from 'http-status-codes';
import { createApp } from '@/app';
import db from '@/database';

describe("GET /api/discussions/previews/me", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
        
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .post('/api/discussions')
            .set('Cookie', cookies)
            .send({ title: "test", content: "test", startDate: new Date(), endDate: new Date(), capacity: 1, thumbnail: "a" });
    });

    test("[GET /api/discussions/previews/me] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        const response = await request(app)
            .get('/api/discussions/previews/me')
            .set('Cookie', cookies)
            .expect(StatusCodes.OK);
        
        response.body.forEach(d => {
            expect(d.userId).toBe(1);
        });
    });
});

describe("GET /api/discussions/previews/:id", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /api/discussions/previews/:id] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        const response = await request(app)
            .get('/api/discussions/previews/1')
            .set('Cookie', cookies)
            .expect(StatusCodes.OK);
        
        response.body.forEach(d => {
            expect(d.userId).toBe(1);
        });
    });
});

/**
describe("", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
    });
});

 */