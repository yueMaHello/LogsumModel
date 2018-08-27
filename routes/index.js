var express = require('express');
var fs = require('fs');
var router = express.Router();
var appName = 'Logsum Model';
var folderNamesAndCsvNames = {};
var folderNames = walkfolders('./public/data/');


Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
for(var i=0;i<folderNames.length;i++){
  var csvNames = walkfolders('./public/data/'+folderNames[i]);
  //console.log(csvNames)
  var usefulPart = csvNames[0].split('.csv')[0].split('Logsum')[1].split('_')
  var usefulLength = usefulPart.length;
  folderNamesAndCsvNames[folderNames[i]] = {}
  for(var n=0;n<usefulLength;n++){

    folderNamesAndCsvNames[folderNames[i]][n] = [];
  }  


  for(var j=0;j<csvNames.length;j++){
    var usefulPart = csvNames[j].split('.csv')[0].split('Logsum')[1].split('_')
    for(var m=0;m<usefulPart.length;m++){
      if(typeof(folderNamesAndCsvNames[folderNames[i]][m])!='undefined'){
        if(folderNamesAndCsvNames[folderNames[i]][m].contains(usefulPart[m])===false){
        
          folderNamesAndCsvNames[folderNames[i]][m].push(usefulPart[m]);
        }
      }


    }

  }

}



router.get('/', function(req, res, next) {
    res.render('index', { title: appName,sliderType:folderNamesAndCsvNames});
});




function walkfolders(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = filelist || [];
    files.forEach(function(file) {
            filelist.push(file);
    });
    return filelist;
}
module.exports = router;
