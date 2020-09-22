const pg = require('pg-promise')();

const pool = new pg('postgres://localhost/img_service');

module.exports = pool;
