const upload = require("../multer/multer");
const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
let authController = require('../controllers/auth');
let dataController = require('../controllers/data-controller')
let publicController = require('../controllers/public-controller');


router.get('/', authController.welcome);
router.get('/users', authController.getUsers);
router.get('/users/:id', publicController.getUser);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/upload',  upload.single('image') , dataController.uploadImage);
router.post('/upload_from_link',  dataController.uploadImageByUrl);
router.get('/profile/images',passport.authenticate('jwt', { session: false }), dataController.getUserFavouritesImages);
router.put('/toFavs', passport.authenticate('jwt', { session: false }), dataController.addToFavorites);
router.delete('/removeFromFavs', passport.authenticate('jwt', { session: false }), dataController.removeFromFavorites);
router.get('/images', dataController.getAllImages);

module.exports = router;

