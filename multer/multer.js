const multer = require('multer');

const PATH = './data/img';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        console.log(file.mimetype);
        cb(null, file.fieldname + '-' + Date.now() + '.' +file.mimetype.split('/')[1]);
    },
})


let upload = multer({
    storage: storage

})

module.exports = upload;
