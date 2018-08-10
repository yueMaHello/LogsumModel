var express = require('express');
var router = express.Router();
var conString = "";
var obj = "1";
var fs = require('fs');


function walkfolders(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = [];
    files.forEach(function(file) {
            filelist.push(file);
    });
    return filelist;
}

var appName = 'Logsum Model';

router.get('/', function(req, res, next) {
    res.render('index', { title: appName});
});

module.exports = router;
