const multer = require('multer');
const path = require('path');

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

   const storage = multer.diskStorage({
        filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
        },
        destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
        }
    });
    const fileFilter = (req, file, cb) => {
        if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        cb(new Error('Invalid file type'));
        } else {
        cb(null, true);
        }
    }
    
    const upload = multer({
        storage,
        fileFilter,
        limits: {
          fieldNameSize: 500,
          fieldSize: 500000000,
        },
      });
      

module.exports = { upload };