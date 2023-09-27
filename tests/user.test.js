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
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[DELETE /api/users] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .delete('/api/users')
            .send({})
            .expect(StatusCodes.OK);
    });
});

describe("GET /api/users/email", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[GET /api/users/email] Success", async () => {
        await request(app)
            .get('/api/users/email')
            .send({ value: "soiledeggrice@naver.com" })
            .expect(StatusCodes.OK);
    });

    test("[GET /api/users/email] Failed: Confict", async () => {
        await request(app)
            .get('/api/users/email')
            .send({ value: "jiyong@sch.ac.kr" })
            .expect(StatusCodes.CONFLICT);
    });

    test("[GET /api/users/email] Failed: Validation failed", async () => {
        await request(app)
            .get('/api/users/email')
            .send({ value: "soiledeggrice" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("GET /api/users/name", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "saewon" });
    });

    test("[GET /api/users/name] Success", async () => {
        await request(app)
            .get('/api/users/name')
            .send({ value: "jiyong" })
            .expect(StatusCodes.OK);
    });

    test("[GET /api/users/name] Failed: Confict", async () => {
        await request(app)
            .get('/api/users/name')
            .send({ value: "saewon" })
            .expect(StatusCodes.CONFLICT);
    });

    test("[GET /api/users/name] Failed: Validation failed", async () => {
        await request(app)
            .get('/api/users/name')
            .send({ value: "soiledeggrice@히히테스트123길어져라길어져라얍abcd12345678" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("PATCH /api/users/name", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[PATCH /api/users/name] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .patch('/api/users/name')
            .send({ nickname: "moonmin" })
            .expect(StatusCodes.OK)
    });

    test("[PATCH /api/users/name] Failed: body not present", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .patch('/api/users/name')
            .send()
            .expect(StatusCodes.UNPROCESSABLE_ENTITY)
    });

    test("[PATCH /api/users/name] Failed: Validation failed", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .patch('/api/users/name')
            .send({ nickname: "길이가45자를넘어야함길이가45자를넘어야함길이가45자를넘어야함길이가45자를넘어야함길이가45자를넘어야함" })
            .expect(StatusCodes.BAD_REQUEST);
    });
});

describe("GET /api/users/preferences", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[GET /api/users/preferences] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        const response = await request(app)
            .get("/api/users/preferences")
            .send()
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
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[PATCH /api/users/preferences] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .patch("/api/users/preferences")
            .send({ commentAlert: true })
            .expect(StatusCodes.OK);
    });

    test("[PATCH /api/users/preferences] Failed: body not present", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        await request(app)
            .patch("/api/users/preferences")
            .send()
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });
});

describe("GET /api/users/me", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[GET /api/users/me] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        const response = await request(app)
            .post("/api/users/me")
            .send()
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty("nickname");
        expect(response.body).toHaveProperty("imageUrl");
        expect(response.body).toHaveProperty("darkmode");
    })
});

describe("GET /api/users/:id", () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });

        await request(app)
            .post('/api/users')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!", nickname: "test" });
    });

    test("[GET /api/users/me] Success", async () => {
        await request(app)
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!"});

        const postResponse = await request(app)
            .get("/api/users/me")
            .send()
        
        const response = await request(app)
            .get(`/api/users/:${postResponse.userId}`)
            .send()
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty("nickname");
        expect(response.body).toHaveProperty("imageUrl");
        expect(response.body).toHaveProperty("darkmode");
    });
});