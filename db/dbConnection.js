const pg = require('pg-promise')();

const db = pg('postgres://localhost/img_service');

exports.getUsers = _ => {

    return db.manyOrNone("SELECT name FROM users_table");
};


exports.register = (user) => {
    return db.result('INSERT INTO users_table(name, password) VALUES($1, $2)', [user.name, user.password]);
}

exports.getUserId = (user) => {
    return db.oneOrNone('SELECT id FROM users_table WHERE name=$1 AND password=$2', [user.name, user.password]);
}

exports.getUserById = (id) => {
    return db.one('SELECT * FROM users_table WHERE id=$1', id);
}

exports.uploadImage = (img_info) => {
    return db.result('INSERT INTO gif_table(name, path, user_id) VALUES($1, $2, $3) RETURNING id', [img_info.name, img_info.path, img_info.user_id]);
}

exports.getAllImagesLinks = () => {
    return db.manyOrNone(`SELECT * FROM gif_table`);
}

exports.getAllImagesByUser = (user_id) => {
    return db.manyOrNone('SELECT id, name path FROM gif_table WHERE user_id=$1', user_id);
}

exports.getFavouriteImagesByUser = (user_id) => {
    return db.manyOrNone(`SELECT id, path FROM gif_table INNER JOIN favourite_gifs_table 
                            ON (favourite_gifs_table.image_id = gif_table.id) WHERE favourite_gifs_table.user_id = $1`, user_id);
}

exports.addToFavorites = (data) => {
    return db.result('INSERT INTO favourite_gifs_table(image_id, user_id) VALUES($1, $2)', [data.image_id, data.user_id]);
}

exports.removeFromFavorites = (data) => {
    return db.result('DELETE FROM favourite_gifs_table WHERE image_id=$1 AND user_id=$2', [data.image_id, data.user_id]);
}

exports.getUserByName = (name) => {
    return db.oneOrNone('SELECT * FROM users_table WHERE name=$1', name);
}

exports.checkIsFavourite = (props) => {

    return db.oneOrNone('SELECT * FROM favourite_gifs_table WHERE user_id=$1 AND image_id=$2', [props.user_id, props.image_id]);
}

exports.getTagId = (tag) => {
    return db.oneOrNone('SELECT id FROM tags_table WHERE name=$1', tag);
}

exports.addNewTag = (tag) => {
    return db.result('INSERT INTO tags_table(name) VALUES($1) RETURNING id', tag);
}

exports.addTagToImage = (params) => {
    return db.result('INSERT INTO gif_to_tag_table (image_id, tag_id) VALUES ($1, $2)', [params.imageId, params.tagId])
}



exports.getAllImagesByTags = (tags) => {
    return db.manyOrNone('SELECT * FROM gif_to_tag_table WHERE ')
}

exports.getTagsIds = (tags) => {
    return db.task(async t => {
        const idOfTags = await t.manyOrNone('select id from tags_table WHERE name IN ($1:csv)', [tags]);
        if (idOfTags.length === 0) {
            return idOfTags;
        }
        let ids = [];
        for (let i of idOfTags) {
            ids.push(i.id);
        }
        const res = await t.manyOrNone('SELECT image_id FROM gif_to_tag_table WHERE tag_id IN ($1:csv)', [ids]);
        let image_ids = [];
        for (let i of res) {
            image_ids.push(i.image_id);
        }
        const count = image_ids.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {});
        Object.filter = (obj, predicate) =>
            Object.keys(obj)
                .filter(key => predicate(obj[key]) )
                .reduce((res, key) => (res[key] = obj[key], res), {} );

        const filtered = Object.filter(count, n => n === tags.length);

        return Object.keys(filtered);
    });
}

exports.getImagesByIds = (ids) => {
    return db.many('SELECT id, path FROM gif_table WHERE id IN ($1:csv)', [ids]);
}
