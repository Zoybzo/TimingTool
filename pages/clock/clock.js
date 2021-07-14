const { ipcRenderer, app } = require("electron");
const path = require('path');
const { fstat } = require('original-fs')
const fs = require("fs");

var h = this.document.getElementById('HH');
var m = this.document.getElementById('mm');
var s = this.document.getElementById('ss');
var textJsonPath = null;

// ipcRenderer.on('time', function (event, args) {
//     console.log(event)
//     console.log(args)
// })

ipcRenderer.on('txt', function (event, args) {
    textJsonPath = args
    check()
    setInterval(check, 30 * 1000)
})
ipcRenderer.on('h', function (event, args) {
    h = args
})
ipcRenderer.on('m', function (event, args) {
    m = args
})
ipcRenderer.on('s', function (event, args) {
    s = args
})

if (h > 60) h = 60
if (m > 60) m = 60
if (s > 60) s = 60
if (h = '') h = 0
if (m = '') m = 0
if (s = '') s = 0

var flag = false

function myTime() {
    if (h == 0 && m == 0 && s == 0) {
        h = 0;
        m = 0;
        s = 0;
        if (!flag) flag = true
        else
            window.close()
    } else if (s != 0) {
        s--;
    } else if (m != 0 && s == 0) {
        s = 59;
        m--;
    } else if (h != 0 && m == 0) {
        m = 60;
        h--;
    }

    document.getElementById('clock').innerText = (h + ':') + m + ':' + s;
}

function check() {
    if (textJsonPath === null) return;
    var result = JSON.parse(fs.readFileSync(textJsonPath))
    var text = null
    if (result != null && result != '') {
        for (var key in result) {

            if (key === 'text') {
                console.log('text');
                text = result[key];
            }
        }
    } else {
        console.log('NullTextJson');
    }

    document.getElementById('clock2').innerText = text
}

myTime()
setInterval(myTime, 1000)

