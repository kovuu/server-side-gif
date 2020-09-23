let dbConnection = require('../db/dbConnection');
const formidable = require('formidable');
const form = formidable ({multiples: true, uploadDir: './data/img', keepExtensions: true});

exports.uploadImage = (req, res) => {
    form.parse(req, (err, fields, files) => {
        let file = files[''];
        const img_info = {
            name: file.name,
            path: file.path,
            user_id: req.headers['x-userid']
        }

        dbConnection.uploadImage(img_info).then(() => {
            res.send('http://localhost/' + img_info.path);
        });

    });
};

exports.getAllImages = (req, res) => {
    dbConnection.getAllImagesLinks().then(r => {
       res.send(r);
    });
};

exports.getMyImages = (req, res) => {
    const userId = req.headers['x-userid'];

    dbConnection.getAllImagesByUser(userId).then((r) => {
        res.send(r);
    });
}

exports.addToFavorites = (req, res) => {
    console.log(req.body.image_id);
    data = {
        image_id: req.body.image_id,
        user_id: req.headers['x-userid']
    }

    dbConnection.addToFavorites(data).then(r => res.send(r));
}

exports.removeFromFavorites = (req, res) => {
    data = {
        image_id: req.body.image_id,
        user_id: req.headers['x-userid']
    }

    dbConnection.removeFromFavorites(data).then(r => res.send(r));
}
