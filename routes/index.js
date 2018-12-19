var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var appName = 'Access Contour';
var currentFolderName = './public/data/';

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};


let sliderType = convertResult('./public/data');
router.get('/', function(req, res, next) {
    res.render('index', { title: appName,sliderType:sliderType});
});
function convertResult(tmpResult){
    let result = {};
    if(is_dir(tmpResult)){
        let children = walkfolders(tmpResult);
        if(is_dir(tmpResult+'/'+children[0])){

            for(let i=0;i<children.length;i++){
                result[children[i]] = convertResult(tmpResult+'/'+children[i])
            }
        }
        else{
            result = children
        }

    }
    else{
        result = tmpResult.split('/').pop()
    }

    return result
}


function walkfolders(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = filelist || [];
    files.forEach(function (file) {
        filelist.push(file.split('.csv')[0]);
    });
    return filelist;
}

function is_dir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

module.exports = router;
