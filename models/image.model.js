module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define('Image', {
        name: {
            type: Sequelize.STRING
        },
        path: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.INTEGER
        }
    });
    return Image;
}
