var express = require('express');
var router = express.Router();
var appName = 'Logsum Model';

router.get('/', function(req, res, next) {
    res.render('index', { title: appName});
});

module.exports = router;
