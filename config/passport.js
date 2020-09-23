const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
let dbConnection = require('../db/dbConnection')


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
};

const strategy = new JwtStrategy(opts, (payload, next) => {
    dbConnection.getUserById(payload.id).then((res) => {
        next(null, res);
    })
})

passport.use(strategy);

module.exports = passport;
