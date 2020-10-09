let dbConnection = require('../db/dbConnection');
const upload = require("../multer/multer");
const https = require('https');
const fs = require('fs');



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

exports.uploadImageByUrl = (req, res) => {
    const imageUrl = req.body.image_url;
    const imgName = 'image'+Date.now()+'.gif';
    const imgPath = `data/img/${imgName}`;
    let file = fs.createWriteStream('./'+imgPath);
    https.get(imageUrl, function (response) {
        response.pipe(file);
        file.on("finish", () => {
            const img_info = {
                name: imgName,
                path: imgPath,
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
        })
    })
}

exports.getAllImages = (req, res) => {
    const userID = req.headers['x-userid'] ? req.headers['x-userid'] : null;
    dbConnection.getAllImagesLinks(userID).then(r => {
       res.send(r);
    });
};

exports.getMyImages = (req, res) => {
    const userId = req.headers['x-userid'];
    dbConnection.getAllImagesByUser(userId).then((r) => {
        res.send(r);
    });
}

exports.getUserFavouritesImages = (req, res) => {
    const userId = req.headers['x-userid'];
    dbConnection.getFavouriteImagesByUser(userId).then((r) => {
        res.send(r);
    })
}

exports.addToFavorites = (req, res) => {
    console.log(req)
    data = {
        image_id: req.body.imgId,
        user_id: req.headers['x-userid']
    }

    dbConnection.addToFavorites(data).then(r => res.send(r));
}

exports.removeFromFavorites = (req, res) => {
    console.log(req.query.imgId);
    image_id = req.query.imgId;
    data = {
        image_id,
        user_id: req.headers['x-userid']
    }

    dbConnection.removeFromFavorites(data).then(r => res.send(r));
}
