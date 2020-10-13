module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define('Tag', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Tag;
}
