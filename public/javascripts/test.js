/*This is an application show logsum model based on travel purpose, income level, auto condition and so on.
As you can see in the './data' folder, there are several sub folders. Files in each sub folder also have different naming formats.
Currently, the app uses six sliders to knowing which one it should choose.
Those six sliders will never be shown at the same time, and sliders will hide and show based on selected Job type (sub folder's name)
Since the logic behind the selection may be not easy to understand, it would be better if you could follow the same data format to update the data.
Otherwise, you will need to change the code to let it suit your newest dataset.
The data in 'dataExample' folder is just a zone-to-zone matrix. It is not sufficient to run the app. You need to follow the format in './data' folder
*/
var map;
var dataMatrix;
var q = d3.queue();
var check = false;//default condition for slider
var largestIndividualArray = [];
var sort = [];
var selectZone = '101'; //default
//initialization of selections
var jobOption = 'Work'; //PSE,Other,Otherpurpose,GS
var incomeOption = 'Med'; //Hi,Lo
var carOption = 'Ins';//No, Suff, Ins, NCAW
var carOption3 = 'Ins';//no suff ins
var purposeOption = "All";//Eat,PB,PUDO,QS,Rec,Shop,Soc
var gradeOption = "Elem";//Elem,JHS,Pre,SHS_Lic,SHS_NoLic
var selectMatrixName='../data/Work/Medium Income/Insuff Car.csv'; //default matrix, show when loading the web page
//load esri libraries
require(["esri/graphic","esri/geometry/Polyline","dojo/dom-construct",
  "esri/tasks/query","esri/dijit/Popup",
  "dojo/dom-class","esri/dijit/BasemapToggle","esri/dijit/Legend",
  "esri/map", "esri/layers/FeatureLayer","esri/symbols/SimpleFillSymbol", 
  "esri/symbols/SimpleLineSymbol","esri/renderers/ClassBreaksRenderer",
  "esri/Color", "dojo/dom-style", "dojo/domReady!"
], function(Graphic,Polyline,domConstruct,Query,Popup,domClass,BasemapToggle,Legend,Map, FeatureLayer,
  SimpleFillSymbol,SimpleLineSymbol,ClassBreaksRenderer,Color, domStyle
) { //convert radios to slider

    //load default csv
    q.defer(d3.csv,selectMatrixName).await(brushMap);
    function brushMap(error,selectMatrix,title){

        let sliderRecord = {
            filePath:null
        };
        let oldSliderRecord = {
            filePath:null
        };

        let maxDepth = checkDepth(sliderType);
        console.log(maxDepth);

        for(let i=1;i<maxDepth+1;i++){
            $('#dynamicRadioContainers').append('<div class="selection" id="'+i+'"></div>');
            sliderRecord[i] = null;
            oldSliderRecord[i] = null;

        }
        setSelection(sliderRecord,1,sliderType);

        function setSelection(record,num,tmpSliderType){
            $('#'+num).append('<div id="'+num+'Radios"></div>');

            if(isDict(tmpSliderType)) {
                for (let k in tmpSliderType) {
                    $('#'+num+'Radios').append('<input type="radio" name="'+num+'Radios" value="'+k+'" id="'+k+'">')
                        .append('<label for="'+k+'">'+k+'</label>')
                }
                $('#'+num+'Radios').radiosToSlider({animation: true});
                $('#'+num+'Radios').click(function(e){
                    if(typeof($("input[name='"+num+"Radios']:checked").val())!=='undefined' && $("input[name='"+num+"Radios']:checked").val()!==oldSliderRecord[num]) {
                        record[num] = $("input[name='" + num + "Radios']:checked").val();
                        record.filePath = null;
                        record  = emptyOtherSelection(num, maxDepth,record);
                        oldSliderRecord = record;
                        setSelection(record, num + 1, tmpSliderType[record[num]]);
                    }
                });
            }
            else{
                for (let k=0;k<tmpSliderType.length;k++) {
                    // $('#'+num).append('<option>' + tmpSliderType[k] + '</option>');
                    $('#'+num+'Radios').append('<input type="radio" name="'+num+'Radios" value="'+tmpSliderType[k]+'" id="'+tmpSliderType[k]+'">')
                        .append('<label for="'+tmpSliderType[k]+'">'+tmpSliderType[k]+'</label>')
                }
                $('#'+num+'Radios').radiosToSlider({animation: true});
                $('#'+num+'Radios').click(function(e){

                    if(typeof($("input[name='"+num+"Radios']:checked").val())!=='undefined' && $("input[name='"+num+"Radios']:checked").val()!==oldSliderRecord[num]) {
                        record[num] =$("input[name='"+num+"Radios']:checked").val();
                        oldSliderRecord[num]=record[num];
                        record.filePath = generateFilePath(num,record);
                        console.log(record.filePath);
                        $("#wait").css("display", "block");
                        redrawLayer(record.filePath);

                    }

                })
            }
        }
        function emptyOtherSelection(num,maxValue,record){
            for(let i=num+1;i<maxValue+1;i++){
                record[i] =null;
                $('#'+i).empty();
            }
            return record
        }
        function generateFilePath(num,record){
            // console.log(record,num)
            result = './data';
            for(let i=1;i<num;i++){
                result = result + '/'+record[i]
            }
            result+='/'+record[num]+'.csv';
            return result

        }
        function redrawLayer(filePath){
          d3.csv(filePath,function(d){
            dataMatrix = buildMatrixLookup(d);
            $("#wait").css("display", "none");
            featureLayer.redraw();
          });
        }
        dataMatrix = buildMatrixLookup(selectMatrix);
        var popup = new Popup({  
          fillSymbol:
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0]), 2)
        }, domConstruct.create("div"));
  
        map = new Map("map", {
            basemap: "dark-gray-vector",
            center: [-113.4909, 53.5444],
            zoom: 9,
            minZoom:6,
            slider: false
        });
        //basemap toggle
        var toggle = new BasemapToggle({
           map: map,
           basemap: "streets"
         }, "viewDiv");
         
         toggle.startup();
               
        var featureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0",{
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
    
        });
        var lrtFeatureLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/LRT/FeatureServer/0",{
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
        });
        // PSELayer = addPSELocation();
        var pseLayer = new FeatureLayer("https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/pse/FeatureServer/0",{
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
        });

        var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 3
          ),
          new Color([125,125,125,0])
        );
        featureLayer.on('click',function(evt){
            map.graphics.clear();
            var graphic = evt.graphic;
            selectZone = graphic.attributes.TAZ_New;
            var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
            map.graphics.add(highlightGraphic);
            featureLayer.redraw();
        });
        var accessibilityResult = [];
        largestIndividualArray = findRangeForIndividualCalcultion();
        sort = Object.values(largestIndividualArray).sort((prev,next)=>prev-next); //from smallest to largest
        sort = sort.map(x =>x.toFixed(2));
        var chunkZones = 89;        
        var symbol = new SimpleFillSymbol(); 
        var renderer = new ClassBreaksRenderer(symbol, function(feature){
          //if 'var check' is false, then show origin to destination
          if(check === false){
            return dataMatrix[selectZone][feature.attributes.TAZ_New];
          }
          //else, destination to origin
          else{
            return dataMatrix[feature.attributes.TAZ_New][selectZone];
          }
       });
       //legend. If you want to change legend scale or legend color, this part of code needs to be modified
       renderer.addBreak(-Infinity, sort[chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
       renderer.addBreak(sort[chunkZones], sort[2*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	249, 238, 237,0.90])));
       renderer.addBreak(sort[2*chunkZones], sort[3*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([243, 224, 219,0.90])));
       renderer.addBreak(sort[3*chunkZones], sort[4*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([237, 214, 202,0.90])));
       renderer.addBreak(sort[4*chunkZones], sort[5*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([225, 200, 170,0.90])));
       renderer.addBreak(sort[5*chunkZones],  sort[6*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([213, 196, 141,0.90])));
       renderer.addBreak(sort[6*chunkZones],  sort[7*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([207, 197, 127,0.90])));
       renderer.addBreak(sort[7*chunkZones], sort[8*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([201, 199, 113,0.90])));
       renderer.addBreak(sort[8*chunkZones], sort[9*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([185, 195, 101,0.90])));
       renderer.addBreak(sort[9*chunkZones], sort[10*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([168, 189, 88,0.90])));
       renderer.addBreak(sort[10*chunkZones], sort[11*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([149, 183, 77,0.90])));
       renderer.addBreak(sort[11*chunkZones], sort[12*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([129, 177, 66,0.90])));
       renderer.addBreak(sort[12*chunkZones], sort[13*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([109, 171, 55,0.90])));
       renderer.addBreak(sort[13*chunkZones], sort[14*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([87, 165, 45,0.90])));
       renderer.addBreak(sort[14*chunkZones], sort[15*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	66, 159, 36,0.90])));
       renderer.addBreak(sort[15*chunkZones], sort[16*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([44, 153, 27,0.90])));  
       renderer.addBreak(sort[16*chunkZones], sort[17*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([	37, 121, 24,0.90])));
       renderer.addBreak(sort[17*chunkZones], sort[18*chunkZones], new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([11, 106, 18,0.90])));
       renderer.addBreak(sort[18*chunkZones], Infinity, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([5, 80, 15,0.90])));
       featureLayer.setRenderer(renderer);
       //legend
        $('#legendDiv').append('<div class="legendClass" id = "legendid" </div>');  
        var legend = new Legend({
          map: map,
          layerInfos: [{layer:pseLayer,title:'Institutions'},{layer:lrtFeatureLayer,title:'LRT'}]
        }, 'legendid');
      
        map.on('load',function(){
            map.addLayer(featureLayer);
            map.addLayer(lrtFeatureLayer);
            map.addLayer(pseLayer);
            legend.startup();
            featureLayer.redraw();
        });
        //slider which is used to switch between 'destination to origin' and 'origin to destination'
        $("#interact").click(function(e, parameters) {
            if($("#interact").is(':checked')){
                check = true;
                $('#sliderNote').html("D&nbspto&nbspO");
                featureLayer.redraw();  
            }
            else{
              check = false;
              $('#sliderNote').html("O&nbspto&nbspD");
              featureLayer.redraw();

            }
        });

    }
});
//read csv file into a 2d matrix
function buildMatrixLookup(arr) {    
  var lookup = {};
  var index = arr.columns;
  var verbal = index[0];
  for(var i =0; i<arr.length;i++){
    var k = arr[i][verbal];
    delete arr[i][verbal];
    lookup[parseInt(k)] = Object.keys(arr[i]).reduce((obj, key) => (obj[parseInt(key)] = Number(arr[i][key]),obj), {});
  }
  return lookup;
}
//legend is based on this range
//why zone 101? Since it is the center of the city
function findRangeForIndividualCalcultion(){
  return dataMatrix['101'];
}
//read radio buttons value and return selected csv url
function findMatrix(){
  $("#wait").css("display", "block");
  var baseDirect = "../data/"+jobOption+'/Logsum';
  if(jobOption === 'Work'){
    baseDirect += incomeOption+'_'+carOption+'.csv';  
  }
  else if(jobOption === 'PSE'){
    baseDirect += carOption3+'.csv';
  }
  else if(jobOption === 'GS'){
    baseDirect += gradeOption+'_'+carOption3+'.csv';
  }
  else if(jobOption==='Other'){
    if(purposeOption === 'All'){
      baseDirect+=carOption3+'.csv';
    }
    else{
      baseDirect = "../data/Otherpurpose/Logsum"+purposeOption+'_'+carOption3+'.csv';
    }
  }
  console.log(baseDirect);
  return baseDirect;
  
}

function checkDepth(object){
    var level = 1;
    var key;
    for(key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if(typeof object[key] == 'object'){
            var depth = checkDepth(object[key]) + 1;
            level = Math.max(depth, level);
        }
    }
    return level;

}
function isDict(v) {
    return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}