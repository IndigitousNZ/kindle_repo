var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
        res.setHeader('Cache-Control', 'max-age=86400, must-revalidate'); //freshness of the resource is for one day
	res.render('landingPage', {user: req.session.user});
});

module.exports = router;