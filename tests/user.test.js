import request from 'supertest'
import { StatusCodes } from 'http-status-codes';
import { createApp } from '@/app';
import db from '@/database';

describe("POST /api/users", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
    });

    test("[POST /api/users] Success", async () => {
        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "jiyong123" })
            .expect(StatusCodes.CREATED)
    });

    test("[POST /api/users] Failed: No request body", async () => {
        await request(app)
            .post('/api/users')
            .send({})
            .expect(StatusCodes.UNPROCESSABLE_ENTITY)
            .expect({ message: `Request body not present.` });
    });

    test("[POST /api/users] Failed: Email validate failed", async () => {
        await request(app)
            .post('/api/users')
            .send({ email: "youngmin", password: "dudals123!", nickname: "nickname123" })
            .expect(StatusCodes.BAD_REQUEST)
            .expect({ message: `Data validation failed.` });
    });

    test("[POST /api/users] Failed: Email Already exists", async () => {
        await request(app) // 일반적인 회원가입 성공 케이스
            .post('/api/users')
            .send({ email: "youngmin1@naver.com", password: "dudals123!", nickname: "영미니1" })
            .expect(StatusCodes.CREATED)

        await request(app)
            .post('/api/users')
            .send({ email: "youngmin1@naver.com", password: "dudals123!", nickname: "영미니2" })
            .expect(StatusCodes.CONFLICT)
            .expect({ message: `[Signup Error#1] Email Already exists.` });
    });

    test("[POST /api/users] Failed: Nickname Already exists", async () => {
        await request(app) // 일반적인 회원가입 성공 케이스
            .post('/api/users')
            .send({ email: "youngmin2@naver.com", password: "dudals123!", nickname: "영미니2" })
            .expect(StatusCodes.CREATED)

        await request(app)
            .post('/api/users')
            .send({ email: "youngmin1@naver.com", password: "dudals123!", nickname: "영미니2" })
            .expect(StatusCodes.CONFLICT)
            .expect({ message: `[Signup Error#1] Email Already exists.` });
    });
});

describe("DELETE /api/users", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });

        await request(app)
            .post('/api/users')
            .send({ email: "dudals@sch.ac.kr", password: "dudals123!", nickname: "dudals123123" })
    });

    test("[DELETE /api/users] Success", async () => {
        const response = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "dudals@sch.ac.kr", password: "dudals123!" });
        
        const cookies = response.headers['set-cookie'];

        await request(app)
            .delete('/api/users')
            .set('Cookie', cookies)
            .expect(StatusCodes.OK);
    });
});

describe("GET /api/users/email", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /api/users/email] Success", async () => {
        await request(app)
            .get('/api/users/email')
            .query({ value: "soiledeggrice@naver.com" })
            .expect(StatusCodes.OK);
    });

    test("[GET /api/users/email] Failed: Confict", async () => {
        await request(app)
            .get('/api/users/email')
            .query({ value: "jiyong@sch.ac.kr" })
            .expect(StatusCodes.CONFLICT);
    });

    test("[GET /api/users/email] Failed: Validation failed", async () => {
        await request(app)
            .get('/api/users/email')
            .query({ value: "soiledeggrice" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("GET /api/users/name", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /api/users/name] Success", async () => {
        await request(app)
            .get('/api/users/name')
            .query({ value: "jiyong" })
            .expect(StatusCodes.OK);
    });

    test("[GET /api/users/name] Failed: Confict", async () => {
        await request(app)
            .get('/api/users/name')
            .query({ value: "jiyong123" })
            .expect(StatusCodes.CONFLICT);
    });

    test("[GET /api/users/name] Failed: Validation failed", async () => {
        await request(app)
            .get('/api/users/name')
            .query({ value: "soiledeggrice@히히테스트123길어져라길어져라얍abcd12345678123123" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("PATCH /api/users/name", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[PATCH /api/users/name] Success", async () => {
        const response = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = response.headers['set-cookie'];

        await request(app)
            .patch('/api/users/name')
            .set("Cookie", cookies)
            .send({ nickname: "moonmin" })
            .expect(StatusCodes.OK)
    });

    test("[PATCH /api/users/name] Failed: body not present", async () => {
        const response = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = response.headers['set-cookie'];

        await request(app)
            .patch('/api/users/name')
            .set("Cookie", cookies)
            .send({})
            .expect(StatusCodes.UNPROCESSABLE_ENTITY)
    });

    test("[PATCH /api/users/name] Failed: Validation failed", async () => {
        const response = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = response.headers['set-cookie'];

        await request(app)
            .patch('/api/users/name')
            .set("Cookie", cookies)
            .send({ nickname: "길이가45자를넘어야함길이가45자를넘어야함길이가45자를넘어야함길이가45자를넘어야함길이가45자를넘어야함123" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("GET /api/users/preferences", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /api/users/preferences] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];

        const response = await request(app)
            .get("/api/users/preferences")
            .set("Cookie", cookies)
            .expect(StatusCodes.OK);
        
        expect(response.body).toHaveProperty("neighborAlert");
        expect(response.body).toHaveProperty("commentAlert");
        expect(response.body).toHaveProperty("chatAlert");
        expect(response.body).toHaveProperty("setNeighborPrivate");
    });
});

describe("PATCH /api/users/preferences", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[PATCH /api/users/preferences] Success", async () => {
        const response = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = response.headers['set-cookie'];

        await request(app)
            .patch("/api/users/preferences")
            .set("Cookie", cookies)
            .send({ commentAlert: true })
            .expect(StatusCodes.OK);
    });

    test("[PATCH /api/users/preferences] Failed: body not present", async () => {
        const response = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = response.headers['set-cookie'];

        await request(app)
            .patch("/api/users/preferences")
            .set("Cookie", cookies)
            .send({})
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });
});

describe("GET /api/users/me", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /api/users/me] Success", async () => {
        const loginResponse= await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];

        const response = await request(app)
            .get("/api/users/me")
            .set("Cookie", cookies)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty("userId");
        expect(response.body).toHaveProperty("nickname");
        expect(response.body).toHaveProperty("imageUrl");
        expect(response.body).toHaveProperty("darkmode");
    })
});

describe("GET /api/users/:id", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: false });
    });

    test("[GET /api/users/:id] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];

        const postResponse = await request(app)
            .get("/api/users/me")
            .set("Cookie", cookies)
        
        const response = await request(app)
            .get(`/api/users/${postResponse.body.userId}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty("nickname");
        expect(response.body).toHaveProperty("imageUrl");
        expect(response.body).toHaveProperty("userId");
    });
});