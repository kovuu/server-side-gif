const express = require('express')
const router = express.Router();

let authController = require('../controllers/auth');

router.get('/', authController.welcome);

router.get('/users', authController.getUsers);

router.post('/register', authController.register);

router.post('/login', authController.login);


module.exports = router;

