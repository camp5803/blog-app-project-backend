import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from '@/utils';
import { errorMiddleware } from '@/middleware';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { routes } from '@/routes';
import db from '@/database';

const app = express();
app.set('trust proxy', true);

// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
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

app.use((req, res, next) => {
    const error = new Error("The route does not exist.");
    error.status = 404;
    next(error);
  });

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
