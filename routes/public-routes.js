const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
let authController = require('../controllers/auth');
let dataController = require('../controllers/data-controller')

router.get('/', authController.welcome);
router.get('/users', passport.authenticate('jwt', {session: false}), authController.getUsers);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/getToken',  authController.getToken);
router.post('/upload', dataController.uploadImage);
 router.post('/profile/images',passport.authenticate('jwt', { session: false }), dataController.getMyImages);
router.put('/toFavs', passport.authenticate('jwt', { session: false }), dataController.addToFavorites);
router.delete('/removeFromFavs', passport.authenticate('jwt', { session: false }), dataController.removeFromFavorites);

module.exports = router;

