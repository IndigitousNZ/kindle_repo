var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var assert = require('assert');
var multer = require('multer');

// Connect DB to service
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://plhoqthkotkzln:d7e741c35258ffecab67002f0f3a0464ee53c7cd0b74e1b862b75d2f961316ec@ec2-184-73-236-170.compute-1.amazonaws.com:5432/d6tutqc2i7u446';
var client = new pg.Client(connectionString);
client.connect();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'assets/images/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '.jpg')
	}
})

var upload = multer({ storage: storage });
var random = Math.floor(Math.random() * 1000000) + 1000
var uniqueNum = Math.floor((Math.random() * random) + 1000);

router.get('/', function (req, res) {
	// var header = req.headers['x-forwarded-proto'];
	// if(header === 'https'){
		var query = client.query("SELECT * FROM productstable;");
		var results = [];
		query.on('row', function(product){
			results.push(product);
		});
		query.on('end', function(){
			res.render('getProduct', {items: results, user: req.session.user});
		});
	// }
	// else{
	// 	res.redirect('https://' + req.url);
	// } 
});

//====================A D M I N - S I D E==============================
router.get('/adminUploadProduct', function (req, res) {
	// var header = req.headers['x-forwarded-proto'];
	// if(header === 'https'){
		if(req.session.user.administrator === true){
			res.render('uploadProduct');
		}
		else{
			res.sendStatus(401);
		}
	// }
	// else{
	// 	res.redirect('https://' + req.url);
	// } 
});

//fix bug and resetz
router.post('/adminUploadProduct', upload.single('photo'), function (req, res) {
	// var header = req.headers['x-forwarded-proto'];
	// if(header === 'https'){
		var product = {
			uniqueid: uniqueNum,
			productName: req.body.productName,
			category: req.body.category,
			gender: req.body.gender,
			size: req.body.size,
			price: req.body.price,
			description: req.body.description,
			quantity: req.body.quantity,
			shippingValue: req.body.shippingValue,
			photo: req.file.path,
			date: Date.now()
		};
		client.query(
			'INSERT INTO productstable(uniqueid, productname, category, gender, size, price, description, quantity, shippingValue, photofile, dateadded) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', 
			[product.uniqueid, product.productName, product.category, product.gender, product.size, product.price, product.description, product.quantity, product.shippingValue, product.photo, product.date]
			);

		res.redirect('/products');
	// }
	// else{
	// 	res.redirect('https://' + req.url);
	// } 
});

//====================U S E R - S I D E==============================
router.get('/:gender/:type', function (req, res) {
//    var header = req.headers['x-forwarded-proto'];
//    if(header === 'https'){
        var data = req.params;
	var query = client.query("SELECT * FROM productstable WHERE gender = '" + data.gender + "' AND category = '" + data.type + "';");
	var results = [];
	query.on('row', function(product){
		results.push(product);
	});
	query.on('end', function(){
		res.render('getProduct', {items: results});
	});
//    }
//    else{
//        res.redirect('https://' + req.url);
//    } 
});

router.get('/search?', function (req, res) {
//    var header = req.headers['x-forwarded-proto'];
//    if(header === 'https'){
        var item = req.query.task;
        var query = client.query("SELECT * FROM productstable " 
                                  + "WHERE productname LIKE '%" + item + "%'"
                                  + "OR category LIKE '%" + item + "%'"
                                  + "OR gender LIKE '" + item + "%'"
                                  + "OR size LIKE '%" + item + "%';");
	var results = [];
	query.on('row', function(product){
		results.push(product);
	});
	query.on('end', function(){
		res.render('getProduct', {items: results});
	});
//    }
//    else{
//        res.redirect('https://' + req.url);
//    } 
});

module.exports=router;
