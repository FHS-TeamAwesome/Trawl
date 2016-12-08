var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var config = require('config');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passportService = require('./passport-service')(passport);

var rootPath = path.join(__dirname, config.get('http.rootPath'));

app.use(express.static(rootPath)); // set the root path to our client folder
app.use(cookieParser());
app.use(session({ secret: config.get('auth.session.secret') }));
app.use(passport.initialize());
app.use(passport.session());

require('./proxy')(app);
require('./routes')(app, passport);

http.listen(process.env.PORT || config.get('http.port'));

console.log('Server listening on port: ', process.env.PORT || config.get('http.port'));
