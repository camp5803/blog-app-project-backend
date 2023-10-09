import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_HOST;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const messageSchema = new mongoose.Schema({
    discussionId: Number,
    userId: Number,
    nickname: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
