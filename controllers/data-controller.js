let dbConnection = require('../db/dbConnection');
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
            .then((r) => {
                const tags = req.body.tags.replace(/\s/g, '').split('#');
                tags.shift();
                const imgId = r.rows[0].id;
                addTagsToImage(req.body.tags, imgId);
                console.log('File is available!');

                return res.status(200).send({
                    message: 'Success!',
                    success: true
                })
            });

    }
};

const addTagsToImage = (tags, imageId) => {
    tags = tags.replace(/\s/g, '').split('#');
    tags.shift();
    for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
    }
    tags = new Set(tags);
    tags = [...tags];

    for (let tag of tags) {
        dbConnection.getTagId(tag).then(async (r) => {
            let tagId;
            if (!r) {
                await addNewTag(tag).then(r => tagId = r.rows[0].id);
            } else {
                tagId = r.id;
            }
            const params = {
                tagId,
                imageId
            }
            await dbConnection.addTagToImage(params).then(r => {
                if(!r) {
                    throw new Error('Тег не добавлен');
                }
            })
        });

    }
}

const addNewTag = (tag) => {
    return dbConnection.addNewTag(tag).then( r => {
        return r;
    });
}

exports.uploadImageByUrl = (req, res) => {
    const imageUrl = req.body.image_url;
    const imgName = 'image'+Date.now()+'.gif';
    const imgPath = `data/img/${imgName}`;
    let file = fs.createWriteStream('./'+imgPath);
    https.get(imageUrl, function (response) {
        response.pipe(file);
        file.on("finish",() => {
            const img_info = {
                name: imgName,
                path: imgPath,
                user_id: req.headers['x-userid']
            }
            dbConnection.uploadImage(img_info)
                .then((r) => {
                    const imgId = r.rows[0].id;
                    addTagsToImage(req.body.tags, imgId);
                    console.log('File is available!');
                    return res.status(200).send({
                        message: 'Success!',
                        success: true
                    })
                });
        })
    })
}

const getAllImagesWithoutTags = async (userID) => {
    let imagesLinks;
    await dbConnection.getAllImagesLinks().then( async (r) => {
        imagesLinks = r;
        await checkIsFavourite(imagesLinks, userID);
    });
    return imagesLinks;
}

exports.getAllImages = async (req, res) => {
    const userID = req.headers['x-userid'] ? req.headers['x-userid'] : null;
    let imagesLinks;
    let tags = req.query.tags.trim().replace(/\s/g, '').split('#');
    tags.shift();
    for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
    }
    tags = new Set(tags);
    tags = [...tags];

    if (tags.length === 0) {
        imagesLinks = await getAllImagesWithoutTags(userID);
        res.send(imagesLinks);
    }

    dbConnection.getTagsIds(tags).then(r => {
        if (r.length === 0) {
            res.send([]);
        }
        if (r) {
            dbConnection.getImagesByIds(r).then(async (response) => {
                imagesLinks = response;
                await checkIsFavourite(imagesLinks, userID);
                res.send(imagesLinks);
            })
        }
    });
};

const checkIsFavourite = async (imagesLinks, userID) => {
    for (let i = 0; i < imagesLinks.length; i++) {

        const props = {
            user_id: userID,
            image_id: imagesLinks[i].id
        }
        await dbConnection.checkIsFavourite(props).then(r => {
            if (r) imagesLinks[i].favourite = true;
            if (!r) imagesLinks[i].favourite = false;
        });
    }
}

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
    data = {
        image_id: req.body.imgId,
        user_id: req.headers['x-userid']
    }

    dbConnection.addToFavorites(data).then(r => res.send(r));
}

exports.removeFromFavorites = (req, res) => {
    image_id = req.query.imgId;
    data = {
        image_id,
        user_id: req.headers['x-userid']
    }

    dbConnection.removeFromFavorites(data).then(r => res.send(r));
}
