import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';
import postRouter from '@/routes/post';
import keywordRouter from '@/routes/keyword'
import commentRouter from '@/routes/comment';
import notificationRouter from '@/routes/notification'

export const routes = [authRouter, userRouter, postRouter, commentRouter, keywordRouter, notificationRouter];