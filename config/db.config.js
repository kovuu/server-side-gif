module.exports = {
    HOST: "localhost",
    USER: "",
    PASSWORD: "",
    DB: "img_service",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
