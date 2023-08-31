import { dotenv } from 'dotenv';
dotenv.config();

export default {
    apps: [
        {
            name: 'blog-app-project-backend',
            script: './server-register.js',
            merge_logs: true,
            autorestart: true,
            watch: true,
            // max_memory_restart: "512M", // 프로그램의 메모리 크기가 일정 크기 이상이 되면 재시작한다.
            env: {
                // 개발 환경설정
                NODE_ENV: 'development',
                PRIVATE_KEY: process.env.PRIVATE_KEY,
                PUBLIC_KEY: process.env.PUBLIC_KEY,
                REDIS_HOST: process.env.REDIS_HOST,
                REDIS_PORT: process.env.REDIS_PORT,
                REDIS_USERNAME: process.env.REDIS_USERNAME,
                REIDS_PASSWORD: process.env.REIDS_PASSWORD,
                REDIS_DATABASE: process.env.REDIS_DATABASE,
                GITHUB_ID: process.env.GITHUB_ID,
                GITHUB_SECRET: process.env.GITHUB_SECRET
            },
            env_production: {
                // 운영 환경설정 (--env production 옵션으로 지정할 수 있다.)
                NODE_ENV: 'production',
            }
        },
    ]
};