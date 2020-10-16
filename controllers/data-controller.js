let dbConnection = require('../db/dbConnection');
const https = require('https');
const fs = require('fs');
const AWS = require('aws-sdk');
const request = require('request');


const db = require("../models");
const Images = db.images;
const Tags = db.tags;
const ImageToTag = db.imageToTag;
const FavouriteImages = db.favouriteImages;
const Op = db.sequelize.Op;

const s3 = new AWS.S3({apiVersion: "latest"});

exports.uploadImage = (req, res) => {
    if (!req.file) {
        console.log("No file is available!");
        return res.status(400).send({
            message: 'No File to available',
            success: false
        });

    } else {
        console.log(req);
        const img_info = {
            name: req.file.originalname,
            path: req.file.location,
            user_id: req.headers['x-userid']
        }
        Images.create(img_info).then(r => {
            const imgId = r.getDataValue('id');
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
        let tagId;
        Tags.findAll({
            where: {
                name: tag
            }
        }).then(async r => {
            if (r.length === 0) {
               await Tags.create({
                    name: tag
                }).then(r => {
                    tagId = r.getDataValue('id');
                })
            } else {
                tagId = r[0].id;
            }
            const params = {
               image_id: imageId,
               tag_id: tagId
            }

            ImageToTag.create(params).then(r => {
                if (!r.getDataValue('image_id')) {
                    throw new Error('Тег не добавлен');
                }
            })
        })
    }
}

const addNewTag = (tag) => {
    return dbConnection.addNewTag(tag).then( r => {
        return r;
    });
}

const uploadFromUrlToS3 = (url) => {
    return new Promise((resolve,reject)=> {
        request({
            url: url,
            encoding: null
        }, function(err, res, body) {
            if (err){
                reject(err);
            }
            const key = Date.now().toString();
            var objectParams = {
                ContentType: 'image/png',
                ContentLength: res.headers['content-length'],
                Key:  key,
                Body: body,
                Bucket: 'gif-service',
                ACL: 'public-read'
            };
            s3.putObject(objectParams).promise().then(r => {
                const res = s3.getSignedUrl('getObject',{Bucket: 'gif-service', Key: key});
                resolve(res.split('?')[0]);
            });

        });
    });
}

exports.uploadImageByUrl = (req, res) => {
    const imageUrl = req.body.image_url;


    uploadFromUrlToS3(imageUrl)
        .then(r => {
            const imageLink = r;

            const img_info = {
                name: 'image',
                path: imageLink,
                user_id: req.headers['x-userid']
            }
            Images.create(img_info).then(r => {
                const imgId = r.getDataValue('id');
                addTagsToImage(req.body.tags, imgId);
                console.log('File is available!');
                return res.status(200).send({
                    message: 'Success!',
                    success: true
                })
            })
        }).catch(function (err) {
            console.log('image not saved', err);
    })
}

const getAllImagesWithoutTags = async (userID) => {
    let imagesLinks;
    await Images.findAll({
        attributes: ['id', 'path', 'user_id'],
        raw: true
    }).then(async r => {
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

    Tags.findAll({
        attributes: ['id'],
        where: {
            name: tags
        }
    }).then(r => {
        if (r.length === 0) {
            res.send([]);
        }
        let ids = [];
        for (let i of r) {
            ids.push(i.id);
        }
        ImageToTag.findAll({
            where: {
                tag_id: ids
            }
        }).then(r => {
            let image_ids = [];
            for (let i of r) {
                image_ids.push(i.image_id);
            }
            const count = image_ids.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {});
            Object.filter = (obj, predicate) =>
                Object.keys(obj)
                    .filter(key => predicate(obj[key]) )
                    .reduce((res, key) => (res[key] = obj[key], res), {} );

            const filtered = Object.filter(count, n => n === tags.length);
            const images = Object.keys(filtered);
            Images.findAll({
                where: {
                    id: images
                },
                raw: true
            }).then(async r => {
                imagesLinks = r;
                await checkIsFavourite(imagesLinks, userID);
                res.send(imagesLinks);
            })
        })

    });
};

const checkIsFavourite = async (imagesLinks, userID) => {
    for (let i = 0; i < imagesLinks.length; i++) {
        await FavouriteImages.findAll({
            where: {
                user_id: userID,
                image_id: imagesLinks[i].id
            }
        }).then(r => {
            imagesLinks[i].favourite = r.length !== 0;
        });
    }
}

exports.getMyImages = (req, res) => {
    const userId = req.headers['x-userid'];
    Images.findAll({
        where: {
            user_id: userId
        },
        raw: true
    }).then(r => {
        res.send(r);
    })
}

exports.getUserFavouritesImages = (req, res) => {
    const userId = req.headers['x-userid'];
    Images.hasMany(FavouriteImages, {foreignKey: 'image_id'});
    FavouriteImages.belongsTo(Images, {foreignKey: 'image_id'});
    FavouriteImages.findAll({
        where: {
            user_id: userId
        },
        include: [Images],
        raw: true,
    })
        .then(r => {
            if (r.length === 0) {
                res.send([]);
            }
            let imagesList = [];
            for (let image of r) {
                imagesList.push({
                    id: image['Image.id'],
                    path: image['Image.path'],
                    user_id: image['Image.user_id']
                })
            }
            res.send(imagesList);
        });
}

exports.addToFavorites = (req, res) => {
    const data = {
        image_id: req.body.imgId,
        user_id: req.headers['x-userid']
    }

    FavouriteImages.create(data).then(r => res.send(r));
}

exports.removeFromFavorites = (req, res) => {
    const image_id = req.query.imgId;
    const data = {
        image_id,
        user_id: req.headers['x-userid']
    }

    FavouriteImages.destroy({
        where: {
            image_id: image_id,
            user_id: data.user_id
        }
    }).then(num  => {
        if (num === 1) {}
            res.send({message: 'Was deleted sucessfully'});
    })
        .catch(err => {
            res.sendStatus(500).send({
                message: 'Could not delete'
            });
        });
}
