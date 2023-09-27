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
        
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .post("/api/keywords")
            .send({ keyword: "히히테스트" });
    });

    test("[GET /api/keywords] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});
    });
});

describe("POST /api/keywords", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});
    });
});

describe("PATCH /api/keywords", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});
    });
});

/**
describe("", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});
    });
});

 */