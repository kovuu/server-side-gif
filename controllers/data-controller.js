let dbConnection = require('../db/dbConnection');


exports.uploadImage = (req, res) => {
    if (!req.file) {
        console.log("No file is available!");
        return res.status(400).send({
            message: 'No File to available',
            success: false
        });

    } else {
        const img_info = {
            name: req.file.originalname,
            path: req.file.destination.substr(2) + '/' + req.file.filename,
            user_id: req.headers['x-userid']
        }
        dbConnection.uploadImage(img_info)
            .then(() => {
                console.log('File is available!');
                return res.status(200).send({
                    message: 'Success!',
                    success: true
                })
            });

    }
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
