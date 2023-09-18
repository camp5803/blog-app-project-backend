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
    afterAll(async () => {
        await db.sequelize.close();
    });

    test("[POST /api/users] Success", async () => {
        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "jiyong123" })
            .expect(StatusCodes.UNPROCESSABLE_ENTITY)
            .expect({ message: `Request body not present.` });
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

describe("POST /api/auth/login", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
    });
    afterAll(async () => {
        await db.sequelize.close();
    });

    test("[POST /api/auth/login] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"})
            .expect((res) => {
                expect(res.status).toBe(StatusCodes.OK);
                expect(res.body)
                    .toHaveProperty("accessToken")
                    .toHaveProperty("refreshToken");
            });
    });

    test("[POST /api/auth/login] Failed: ValidationError", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong2", password: "dudals123!@" })
            .expect(StatusCodes.CONFLICT)
            .expect({ message: "Data validation failed." });
    });

    test("[POST /api/auth/login] Failed: User not found", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "fakedudals@naver.com", password: "dudals123!" })
            .expect(StatusCodes.NOT_FOUND)
            .expect({ message: "User not found." });
    });

    test("[POST /api/auth/login] Failed: Invalid password.", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!@" })
            .expect(StatusCodes.CONFLICT)
            .expect({ message: "Please check your email and password." });
    });
});

describe("POST /api/auth/refresh", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
    });
    afterAll(async () => {
        await db.sequelize.close();
    });

    test("[POST /api/auth/refresh] Success", async () => {
        await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/users/login')
            .data({ email: "jiyong@sch.ac.kr", password: "dudals123!" });

        await request(app)
            .post('/api/auth/refresh')
            .expect(StatusCodes.OK);
    });
})

/**
describe("", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
});

 */