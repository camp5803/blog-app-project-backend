import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from '@/utils/index';
import { errorMiddleware } from '@/middleware/index';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { routes } from '@/routes/index.js';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: true,
        credentials: true,
        exposedHeaders: ['Content-Disposition'],
    })
);
app.use(compression());
app.use(morganMiddleware);

// routes
routes.forEach((route) => {
    app.use('/api', route);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
