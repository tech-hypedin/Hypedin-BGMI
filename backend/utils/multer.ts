import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const taskUploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 35 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|mp4|webp/;
        const isMimeValid = allowedTypes.test(file.mimetype);
        const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (isMimeValid && isExtValid) {
            return cb(null, true);
        }
        cb(new Error('Invalid file format. Only JPEG, PNG, and WEBP images are supported.'));
    }
});