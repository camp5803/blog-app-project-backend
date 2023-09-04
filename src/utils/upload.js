import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3 } from 'aws-sdk';

const fileValidator = (req, file, cb) => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedFormats.includes(file.mimetype)) {
        return cb(null, true);
    }
    return cb(null, false);
}

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
        cb(null, `profile_img/${Date.now()}-${file.originalname}`);
    }
});

const limits = { fileSize: 1024 * 1024 * 5 };

export const upload = multer({ storage, fileFilter: fileValidator, limits });