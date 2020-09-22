const express = require('express');
const app = express();
const parser = require('body-parser')

const routes = require('./routes/public-routes')

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use('/', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT);

