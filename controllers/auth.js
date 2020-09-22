let dbConnection = require('../db/dbConnection')


exports.login = (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password
    }
    dbConnection.login(user).then((r) => {
        if(!r) {
            res.send('user not found');
        } else {
            res.send('success!');
        }
    });
};

exports.register = (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password
    }
    dbConnection.register(user, res).then(res.send('ok'));
};

exports.getUsers = (req, res) => {
    dbConnection.getUsers().then(r => res.send(r));
};

exports.welcome = (req, res) => {
    res.send('Hello World');
};
