import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from '@/utils';
import { errorMiddleware } from '@/middleware';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { passportConfig } from '@/common'
import { routes } from '@/routes';
import db from '@/database';

const app = express();
app.set('trust proxy', true);

// middlewares
app.use(passport.initialize());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: false }));
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
