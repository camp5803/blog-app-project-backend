import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from '@/utils/index';
import { errorMiddleware, limiter } from '@/middleware/index';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { passportConfig } from '@/common/index'
import { routes } from '@/routes/index.js';
import db from '@/database/index.js';

const app = express();

// middlewares
app.use(passport.initialize());
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
app.use(limiter);
passportConfig();

// routes
routes.forEach((route) => {
    app.use('/api', route);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
