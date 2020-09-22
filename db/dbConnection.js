const pg = require('pg-promise')();

const db = pg('postgres://localhost/img_service');

exports.getUsers = _ => {
    return db.manyOrNone("SELECT name FROM users_table");
};

exports.register = (user) => {
    return db.result('INSERT INTO users_table(name, password) VALUES($1, $2)', [user.name, user.password]);
}

exports.login = (user) => {
    return db.oneOrNone('SELECT id FROM users_table WHERE name=$1 AND password=$2', [user.name, user.password]);
}
