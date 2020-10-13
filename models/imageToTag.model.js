module.exports = (sequelize, Sequelize) => {
    const ImageToTag = sequelize.define('ImageToTag', {
        image_id: {
            type: Sequelize.INTEGER
        },
        tag_id: {
            type: Sequelize.INTEGER
        }
    });
    ImageToTag.removeAttribute('id');
    return ImageToTag;
}
