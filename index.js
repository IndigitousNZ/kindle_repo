var fs = require('fs');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var OpenIDStrategy = require('passport-openid').Strategy;

var port = process.env.PORT || 8080;
var routes = require('./routes/app');
var users = require('./routes/users');
var products = require('./routes/products');

// Init App
var app = express();

// Init Passport 
app.use(passport.initialize());
//app.use(passport.session());

// Connect DB to service
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://plhoqthkotkzln:d7e741c35258ffecab67002f0f3a0464ee53c7cd0b74e1b862b75d2f961316ec@ec2-184-73-236-170.compute-1.amazonaws.com:5432/d6tutqc2i7u446';
var client = new pg.Client(connectionString);
client.connect();

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  //store: new (require('connect-pg-simple')(express.session))(),
  secret: 'secret', //change this to be harder
  saveUninitialized: false,
  resave: false,
  cookie: {
  	secure: !true,
  	maxAge: 60 * 60 * 1000 // = 1 hour
  }
}));


//Routes
app.use('/', routes);
app.use('/users', users);
app.use('/products', products);

//View Sub-Routes
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout:'appFramework'}));
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// Global Error handling
app.use(function (req, res, next) {
  res.locals.user = req.session;
  next();
});

//app.set('trust proxy', 1) // trust first proxy 
// var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour <- change to a specification
// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: true,
//     httpOnly: true,
//     domain: 'blah.com', //change
//     path: 'blob/beerr', //change
//     expires: expiryDate
//   }
// }))

 //save sessions change this to true
 //use memory storage or memcache
 //sessions are stored on the sever
 //client and cookie will sotre the ssion idea
app.listen(port, function() {
	console.log('App listening on port ' + port);
});