var electron = require('electron')
const { BrowserWindow } = require('electron/main')
const path = require('path');
const { fstat } = require('original-fs')
const fs = require("fs");
const browserWindow = electron.BrowserWindow // use window

var app = electron.app // use app
const configJson = path.join(__dirname, "config/config.json").replace(/\\/g, "\/");

var mainWindow = null // the main window

var result = null;
var timeJson = null, textJson = null;

// fs.exists(configJson, function (exists) {
//   console.log(exists ? "文件存在" : "文件不存在");
//   if (!exists) {
//     $(".errorInformation").show();
//     $(".errorInformation").text("查找失败，文件不存在!");
//     return;
//   } else {
//     
//     //读取本地的json文件
//     console.log(JSON.parse(fs.readFileSync(configJson)));
//     console.log('here');
//   }
// });

result = JSON.parse(fs.readFileSync(configJson));

if (result != null && result != '') {
  for (var key in result) {

    if (key === 'timeJsonPath') {
      timeJson = result[key];
    }
    else if (key === 'textJsonPath') {
      textJson = result[key];
    }
  }
} else {
  console.log('NullResult');
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 500, height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // load page
  if (process.argv.length != 2) {
    var choose = process.argv[2];
    switch (choose) {
      case '0':
        mainWindow = new BrowserWindow({
          fullscreen: true,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          }
        })

        mainWindow.loadFile('pages/clock/clock.html')
        var h = process.argv[3]
        var m = process.argv[4]
        var s = process.argv[5]

        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.send('h', h)
          mainWindow.webContents.send('m', m)
          mainWindow.webContents.send('s', s)
        })
        break;
      case '1':
        mainWindow.loadFile('pages/input/index.html')
        break;
      case '2':
        mainWindow = new BrowserWindow({
          fullscreen: true,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          }
        })

        mainWindow.loadFile('pages/clock/clock.html')

        var h = null, m = null, s = null;

        result = JSON.parse(fs.readFileSync(timeJson))
        if (result != null && result != '') {

          for (var key in result) {

            if (key === 'hh') {
              h = result[key];
            } else if (key === 'mm') {
              m = result[key];
            } else if (key === 'ss') {
              s = result[key];
            }
          }
        } else {
          console.log('NullTimeJson');
        }
        
        mainWindow.webContents.on('did-finish-load', () => {
          mainWindow.webContents.send('txt', textJson)
          mainWindow.webContents.send('h', h)
          mainWindow.webContents.send('m', m)
          mainWindow.webContents.send('s', s)
        })
        break;
      default:
        console.log("ErrorNumber");
        break;
    }
  } else {
    mainWindow.loadFile('pages/input/index.html')
  }

  mainWindow.on('close', () => {
    mainWindow = null
  })
})