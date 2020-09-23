let dbConnection = require('../db/dbConnection');

exports.getUser = (req, res) => {
    const userId = req.params.id;
    dbConnection.getUserById(userId).then(r => res.send(r));
}
