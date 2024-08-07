import multer from "multer";
import fs from 'fs';

const directories = ['src/public/profiles', 'src/public/products', 'src/public/documents'];
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let dest = 'src/public/documents'; // Default destination
        if (file.fieldname === 'profile') {
            dest = 'src/public/profiles';
        } else if (file.fieldname === 'product') {
            dest = 'src/public/products';
        }

        cb(null, dest);
        console.log(`uploaded to ${dest}`);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }});