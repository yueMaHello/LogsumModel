# Logsum Model 
This is a Nodejs web application using Arcgis Javascript API. It shows logsum matrices with a gravity map format. The user can change the combinations of properties on the right corner to get various results.

As you can see in the './data' folder, there are several sub folders. You can change the data structure to the similar format. The application will automatically generate slider bars based on your data structure.

The data in 'dataExample' folder is just a zone-to-zone matrix. It is not sufficient data example to run the app. You need to follow the format in './data' folder

## Set Up
#### From Github:
1. If you haven't downloaded Nodejs on your computer, you need to download it and add it into PATH.
2. Download this folder
3. Browse to the root of the folder
4. Open the terminal/cmd and go to the root of the App './logsumModel'. 
5. Type 'npm install'
6. Type 'npm intall express --save'
7. Type 'npm install http-errors --save'
8. Type 'npm install fs --save'
9. Put your csv data into './public/data' folder. Cherry can help with the data source. Finally, './data' folder should consist five other folders: './data/GS', './data/Other', './data/Otherpurpose', './data/PSE', and './data/Work'
10. Each CSV file must have the same format as the example data located in './public/dataExample/Auto Time.csv'. For element in row[0]column[0], it can be empty or some text.
#### From Lab Computer I
1. Browse to the root of the folder
2. Open the terminal/cmd and go to the root of the App './logsumModel'. 
3. In the './public/data/' folder, all the data source is provided.

## Run
1. Use terminal/cmd to go to the root of the App './logsumModel'. 
2. Type 'npm start'
2. Browse 'http://localhost:3034'

## Use tips:
#### If you want to update the dataset:
All the logsum data set is provided by Cherry. If you just want to simply renew the dataset without changing the structure or name, you can replace csv files into new ones one by one. However, if you want to change the structure of the data set, then you have to change the code in css, jade and javascript files.
#### If you want to update the TravelZoneLayer shape file:
 1. The map layer is not stored in localhost. It is stored in the arcgis online server.
 2. In './public/javascript/test.js', you can find the current layer: 'https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0'. If you want to change it to another layer, you can create you own arcgis online account and upload the layer to the arcgis server. You need to replace the url into a new one. You can also ask Sandeep to access Yue Ma's arcgis account.
#### If you want to change the legend:
1. Open './public/javascripts/test.js' file, search 'readerer.addBreak' to show that part of code.
2. Right now, the break points all are calculated based on data of zone[101]. It can adjust the legend to suit different dataset. If you want to change the break points, you could just manually change 'sort[chunkZone]' to some specific value. 
      For exampe:
      * renderer.addBreak(0, 70, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
      * renderer.addBreak(70, 150, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([249, 238, 237,0.90])));
#### If you want to change the legend color:
1. Open './public/javascripts/test.js' file, search 'readerer.addBreak' to show that part of code.
2. Change 'new Color([255, 255, 255,0.90])' to some other RGB color.
#### Rules of selection
1. The user needs to select job type first (Work,PSE,Grade School, Others...)
2. The app will show and hide slider based on job type selection
#### Woops, the App can't run after changing a new dataset:
 1. You need to restart the server from terminal/cmd (Rerun 'npm start').



