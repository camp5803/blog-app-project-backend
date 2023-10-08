require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'blog-app-project-backend-test',
            script: './server-register.js',
            merge_logs: true,
            autorestart: true,
            watch: true,
            max_memory_restart: "512M",
            env: {
                // 개발 환경설정
                NODE_ENV: 'development',
                PORT: 8000,
                SERVER_URL: "jiyong.world",
                SECURE_ENABLED: true,
                PRIVATE_KEY: process.env.PRIVATE_KEY,
                PUBLIC_KEY: process.env.PUBLIC_KEY,
                REDIS_HOST: process.env.REDIS_HOST,
                REDIS_PORT: process.env.REDIS_PORT,
                REDIS_USERNAME: process.env.REDIS_USERNAME,
                REDIS_PASSWORD: process.env.REDIS_PASSWORD,
                REDIS_DATABASE: process.env.REDIS_DATABASE,
                GITHUB_ID: process.env.GITHUB_ID,
                GITHUB_SECRET: process.env.GITHUB_SECRET,
                KAKAO_ID: process.env.KAKAO_ID,
                KAKAO_SECRET: process.env.KAKAO_SECRET,
                GOOGLE_ID: process.env.GOOGLE_ID,
                GOOGLE_SECRET: process.env.GOOGLE_SECRET,
                AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
                AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
                AWS_REGION: process.env.AWS_REGION,
                AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
                ZOHO_USER: process.env.ZOHO_USER,
                ZOHO_APP_SECRET: process.env.ZOHO_APP_SECRET,
                MONGODB_HOST: process.env.MONGODB_HOST
            },
            env_production: {
                NODE_ENV: 'production',
            }
        },
    ]
};
