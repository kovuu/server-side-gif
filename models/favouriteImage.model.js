module.exports = (sequelize, Sequelize) => {
    const FavouriteImage = sequelize.define('FavouriteImage', {
        image_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        }
    });
    FavouriteImage.removeAttribute('id');
    return FavouriteImage;
}
