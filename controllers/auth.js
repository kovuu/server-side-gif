let dbConnection = require('../db/dbConnection')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require("../models");
const User = db.users;
const Op = db.sequelize.Op;


exports.login = async (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.status(412).send('No login or Password');
    }
    const loginData = {
        name: req.body.name,
        password: req.body.password
    }

    await User.findAll({
        where: {
            name: loginData.name
        }
    }).then(r => {
        const user = r[0].dataValues;
        if (!bcrypt.compareSync(loginData.password, user.password)) {
            res.status(403).send('not correct password');
            return;
        }
        let userID = {id: user.id};
        let token = getToken(userID);
        let result = {
            token: token,
            id: user.id
        }
        res.send(result);
    });

};

exports.register = async (req, res) => {
    if (!req.body.name || !req.body.password) {
        res.status(412).send('No login or Password');
    }
    const user = {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10)
    }

    await User.create(user)
        .then(data => {
            res.send({msg: 'user has been register'});
        })
        .catch(err => {
            res.status(403).send('error while writing in database');
        })

    // dbConnection.register(user, res).then((r) => {
    //     if (!r) {
    //         res.status(403).send('error while writing in database');
    //     }
    //     res.send({msg: 'user has been register'});
    // });
};

exports.getUsers = (req, res) => {
    User.findAll().then(r => res.send(r));
};

exports.welcome = (req, res) => {
    res.send('Hello World');
};

getToken = (userID) => {
    return jwt.sign(userID, process.env.SECRET_OR_KEY);
}
