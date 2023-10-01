import request from 'supertest'
import { StatusCodes } from 'http-status-codes';
import { createApp } from '@/app';
import db from '@/database';

describe("GET /api/keywords", () => {
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
            .post("/api/keywords")
            .set('Cookie', cookies)
            .send({ keyword: "히히테스트" });
    });

    test("[GET /api/keywords] Logined: Success", async () => {
        const keys = ['keywordId', 'keyword'];
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        const response = await request(app)
            .get('/api/keywords')
            .set('Cookie', cookies)
            .expect(StatusCodes.OK)

        expect(response.body).toEqual(expect.arrayContaining(
            keys.map((key) => 
                expect.objectContaining({ [key]: expect.anything() })
            )
        ));
    });

    test("[GET /api/keywords] Not signed: Success", async () => {
        const keys = ['keywordId', 'keyword'];
        const response = await request(app)
            .get('/api/keywords')
            .expect(StatusCodes.OK)

        expect(response.body).toEqual(expect.arrayContaining(
            keys.map((key) => 
                expect.objectContaining({ [key]: expect.anything() })
            )
        ));
    });
});

describe("POST /api/keywords", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[POST /api/keywords] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .post('/api/keywords')
            .set("Cookie", cookies)
            .send({ keyword: "TEST" })
            .expect(StatusCodes.CREATED);
    });

    test("[POST /api/keywords] Failed: body not present", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .post('/api/keywords')
            .set("Cookie", cookies)
            .send({})
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    test("[POST /api/keywords] Failed: Validation failed", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .post('/api/keywords')
            .set("Cookie", cookies)
            .send({ keyword: "45자를넘겨버리기45자를넘겨버리기45자를넘겨버리기45자를넘겨버리기45자를넘겨버리기123" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("DELETE /api/keywords", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[DELETE /api/keywords] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .delete('/api/keywords')
            .set("Cookie", cookies)
            .send({ keyword: "TEST" })
            .expect(StatusCodes.OK);
    });

    test("[DELETE /api/keywords] Failed: body not present", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .delete('/api/keywords')
            .set("Cookie", cookies)
            .send({ keyword: "없는키워드" })
            .expect(StatusCodes.PRECONDITION_REQUIRED);
    });

    test("[DELETE /api/keywords] Failed: keyword not exist", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .delete('/api/keywords')
            .set("Cookie", cookies)
            .send({ keyword: "TEST" })
            .expect(StatusCodes.OK);
    });
});

describe("GET /keywords/:id", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /keywords/:id] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        const response = await request(app)
            .get(`/api/keywords/${loginResponse.body.userId}`)
            .set("Cookie", cookies)
            .expect(StatusCodes.OK)
        
        response.body.forEach(k => {
            expect(k.keywordId).toBe(loginResponse.body.userId.toString());
        });
    });
});

describe("GET /keywords/search", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /keywords/search] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        const response = await request(app)
            .get(`/api/keywords/search`)
            .query({ value: "히히 "})
            .set("Cookie", cookies)
            .expect(StatusCodes.OK)

        response.body.forEach(k => {
            expect(k.keyword.includes("히히")).toBeTruthy();
        });
    });
});