const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const parser = require('body-parser');
const passport = require('./config/passport');
const cors = require('cors')

const routes = require('./routes/public-routes')
app.use(cors());

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use('/', routes);
app.use('/data/img', express.static(__dirname + '/data/img'));

const db = require("./models");
db.sequelize.sync();


app.use(passport.initialize());

app.listen(process.env.PORT || 80);

module.exports = app;
