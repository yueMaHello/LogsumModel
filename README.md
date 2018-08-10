# Logsum Model 
This is a Nodejs web application using Arcgis Javascript API. It shows different logsum matrix in a gravity map format.
## Set Up
1. Download this folder
2. Browse to the root of the folder
3. Open the terminal/cmd and go to the root of the App './logsumModel'. 
4. Type 'npm install'
5. Type 'npm intall express --save'
5. Type 'npm install http-errors --save'
6. Type 'npm install fs --save'
7. Put your csv data into './public/data' folder. The data should be a zone-to-zone matrix. You can name the csv file to anything you want, and the App will show you a title with that csv file name. For example, if you put 'Auto Travel.csv' into the data folder, then the App will be named as 'Auto Travel' when browsing it.
8. The data must have the same format as the example data located in './public/dataExample/Auto Time.csv'. If you browse the csv file through Excel, [0,0] should be empty, but not something like 'z/z'. If your [0,0] is not empty, you have to manually delete it.

## Run
1. Use terminal/cmd to go to the root of the App './generalHeatmap'. 
2. Type 'npm start'
2. Browse to 'http://localhost:3033'

## Use tips:
#### If you want to duplicate the App, change the dataset, and render the App at another port other than '3033':
      1. Copy and paste all the content into a new folder
      2. Change the dataset located in 'public/data' into anther one.
      3. Open 'bin/www.js' file, and search for '3033'
      4. Simply change '3033' to other number (3036, 5025, 4022 or such).
      5. Then, just follow the procedure in 'Run'



