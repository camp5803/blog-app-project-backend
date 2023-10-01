import request from 'supertest'
import { StatusCodes } from 'http-status-codes';
import { createApp } from '@/app';
import db from '@/database';

describe("GET /api/post/previews", () => {
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
            .post('/api/post')
            .set('Cookie', cookies)
            .send({ title: "링딩동", content: "디기딩디기딩" });

        await request(app)
            .post('/api/post')
            .set('Cookie', cookies)
            .send({ title: "이건좋아요", content: "디기딩디기딩" });

        await request(app)
            .post('/api/post')
            .set('Cookie', cookies)
            .send({ title: "댓글", content: "디기딩디기딩" });
    });

    test("[GET /api/post/previews] Success", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app) // 원본에서 수정해야함
            .post('/api/post/2/like')
            .set('Cookie', cookies)
        
        await request(app)
            .post('/api/comment')
            .set('Cookie', cookies)
            .send({ postId: 3, content: "댓글" });

        await request(app)
            .get('/api/post/previews')
            .set('Cookie', cookies);

        const likeResponse = await request(app)
            .get('/api/post/previews')
            .set('Cookie', cookies)
            .query({ type: "like" })
            .expect(StatusCodes.OK);
        
        const commentResponse = await request(app)
            .get('/api/post/previews')
            .set('Cookie', cookies)
            .query({ type: "comment" })
            .expect(StatusCodes.OK);
        
        const meResponse = await request(app)
            .get('/api/post/previews')
            .set('Cookie', cookies)
            .query({ type: "me" })
            .expect(StatusCodes.OK);

        expect(likeResponse.body.title).toBe("이건좋아요");
        expect(commentResponse.body.title).toBe("댓글");
        expect(meResponse.body.title).toBe("링딩동");
    });

    test("[GET /api/post/previews] Failed: request body not present", async () => {
        const loginResponse = await request(app) // 로컬 로그인으로 쿠키 발급
            .post('/api/auth/login')
            .send({ email: "jiyong@sch.ac.kr", password: "dudals123!" });
        
        const cookies = loginResponse.headers['set-cookie'];
        await request(app)
            .get('/api/post/previews')
            .set('Cookie', cookies)
            .query({})
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
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