import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from '@/utils';
import { errorMiddleware } from '@/middleware';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { routes } from '@/routes';
import { socket } from '@/socket/socket';
import http from 'http';
import {Server} from 'socket.io';

export const createApp = () => {
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

    // error routes
    app.use((req, res, next) => {
        const error = new Error("The route does not exist.");
        error.status = 404;
        next(error);
    });
    app.use(errorMiddleware);

    const server = http.createServer(app);
    const io = new Server(server, {
        // path: '/'
    });
    socket(io);

    return server;
}