import { createApp } from '@/app';
import db from '@/database';

const startServer = () => {
    const app = createApp();
    const PORT = process.env.PORT || 3000;
    db.sequelize.sync({ force: false }).then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://${process.env.SERVER_URL}:${PORT}`);
        });
    });
}

startServer();