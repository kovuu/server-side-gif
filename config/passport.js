const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const db = require("../models");
const User = db.User;


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY || 'jqwoiejqwoejwqoiwqjewoq'
};

const strategy = new JwtStrategy(opts, (payload, next) => {
    User.findAll({
        where: {
            id: payload.id
        },
        raw: true
    }).then(r => next(null, r));
})

passport.use(strategy);

module.exports = passport;
