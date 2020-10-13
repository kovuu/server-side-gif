const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://localhost/img_service');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});

module.exports = User;






