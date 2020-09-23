let dbConnection = require('../db/dbConnection')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.login = (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password
    }
    dbConnection.getUserId(user).then((r) => {
        if(!r) {
            res.send('user not found');
        } else {
            getToken(req, res);
        }
    });
};

exports.register = (req, res) => {
    console.log(bcrypt.hashSync(req.body.password, 10));
    const user = {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    dbConnection.register(user, res).then(res.send('ok'));
};

exports.getUsers = (req, res) => {
    dbConnection.getUsers().then(r => res.send(r));
};

exports.welcome = (req, res) => {
    res.send('Hello World');
};

getToken = (req, res) => {
    if (!req.body.name || !req.body.password) {
        return res.status(400).send('user not found');
    }
    const User = {
        name: req.body.name,
        password: req.body.password
    };

    dbConnection.getUserId(User).then(userID => {
        const token = jwt.sign(userID, process.env.SECRET_OR_KEY);
        res.send({ token: token, id: userID.id});
    })
}
