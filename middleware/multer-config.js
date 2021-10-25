const multer = require('multer');

const MIME_TYPES = {
    "image/jpg": 'jpg',
    "image/jpeg": 'jpg',
    "image/png": 'png'

}

// obj confif multer
const storage = multer.diskStorage({
    //Register on disk - destination => where to store file
    destination: (req, file, callback) => {
        //null = no error, then image = destination
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        //new file name - split/join =  replace space on file name by underscore
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        //Date.now = timestamp
        callback(null, name + Date.now() + '.' + extension);
    }
});

// .single('image') = file unique which is an img
module.exports = multer({ storage: storage }).single('image');