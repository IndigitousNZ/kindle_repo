var express = require('express');
var router = express.Router();

//Db connect
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost/dean';
var client = new pg.Client(connectionString);
client.connect();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

router.get('/signup', function (req, res) {
  if(req.session.user){
    res.sendStatus(400);
  }else{
    res.setHeader('Cache-Control', 'max-age=21600, must-revalidate'); //freshness of the resource is for 6 hours
    res.render('signup');
  }
});

var calculate = (Date.now() + Math.floor(Math.random() * 100) + 10);

router.post('/signup', function (req, res) {
  var validUser = {
    id: calculate,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    hash: bcrypt.hashSync(req.body.password, salt)
  } 
  client.query('SELECT * FROM churchtable WHERE email=($1);', [validUser.email], function(err, result) {
    if(result.rows.length>0){
     res.render('signup', {taken: true}); 
   }
   else{
      var call = "INSERT INTO churchtable (id,firstname,lastname,email,password,church) VALUES ($1,$2,$3,$4,$5,$6)";
      client.query(call, [validUser.id, validUser.firstname,validUser.lastname, validUser.email,validUser.hash,false], 
        function(error, result) {
          console.log("jo1 " + validUser);
          req.session.user = validUser;
          validUser=null;
          console.log("jo2 " + validUser);
          res.redirect('/products'); //this should have the users link
        });
    }
  });//end of db query
}); //end of shiz

router.get('/login', function (req, res) {
  if(req.session.user){
    res.sendStatus(400);
  }else{
   res.setHeader('Cache-Control', 'max-age=21600, must-revalidate'); //freshness of the resource is for 6 hours
   res.render('login');
 }
});

router.post('/login', function(req, res) {
  var validUser = {
    email: req.body.email,
    password: req.body.password
  }
  client.query('SELECT * FROM userstable WHERE email=($1);', [validUser.email], function(err, result) {
   if(result.rows.length==0){
       res.render('login', {invalidEmail: true}); //convert to AJAX if there is more time!
     } else{ 
      bcrypt.compare(validUser.password, result.rows[0].password, function(err, isMatch) {
        if(err) throw err;
        if(isMatch===true){
          req.session.user = result.rows[0];
          res.redirect('/products'); //this should have the users link
        } else {
           res.render('login', {incorrectPassword: true}); //convert to AJAX if there is more time!
         }
       }); 
    }
  });
});

router.get('/logout',function(req,res){
  if(req.session.user){
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        res.render('landingPage');
      }
    });
  }else{
   res.sendStatus(400);
 }
});

module.exports=router

// var header = req.headers['x-forwarded-proto'];
  // if(header === 'https'){

  // }
  // else{
  //   res.redirect('https://' + req.url);
  // } 