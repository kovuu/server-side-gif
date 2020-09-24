let dbConnection = require('../db/dbConnection')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.login = (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.status(412).send('No login or Password');
    }
    const loginData = {
        name: req.body.name,
        password: req.body.password
    }
    dbConnection.getUserByName(loginData.name).then((r) => {
        if(!r) {
            res.status(403).send('user not found');
        }
        if (!bcrypt.compareSync(loginData.password, r.password)) {
            res.status(403).send('not correct password');
        }
        let userID = {id: r.id};
        let token = getToken(userID);
        let result = {
            token: token,
            id: r.id
        }
        res.send(result);
    });
};

exports.register = (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.status(412).send('No login or Password');
    }
    const user = {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    dbConnection.register(user, res).then((r) => {
        if (!r) {
            res.status(403).send('error while writing in database');
        }
        res.send({msg: 'user has been register'});
    });
};

exports.getUsers = (req, res) => {
    dbConnection.getUsers().then(r => res.send(r));
};

exports.welcome = (req, res) => {
    res.send('Hello World');
};

getToken = (userID) => {
    return jwt.sign(userID, process.env.SECRET_OR_KEY);
}
