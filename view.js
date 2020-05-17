const { ipcRenderer, remote } = require('electron');

const btnClick = document.getElementById('start');
dialog = remote.dialog;
WIN = remote.getCurrentWindow();

const audioBtn = document.getElementById('audioButton');
const videoBtn = document.getElementById('videoButton');
const logoBtn = document.getElementById('logoButton');
const outputBtn = document.getElementById('outputButton');

const audioDefault = document.getElementById('audioDefault');
const videoDefault = document.getElementById('videoDefault');
const logoDefault = document.getElementById('logoDefault');
const outputDefault = document.getElementById('outputDefault');

var audioFile;
var videoFile;
var logoFile;
var outputPath;

process.once('loaded', function() {
    window.addEventListener('message', function(evt) {
        if (evt.data.type == 'select-dirs') {
            ipcRenderer.send('select-dirs');
        }
    });
});

btnClick.addEventListener('click', function() {
    if (audioFile && videoFile && logoFile && outputPath) {
        let arguments = {
            'audioPath': audioFile,
            'videoPath': videoFile,
            'logoPath': logoFile,
            'outputPath': outputPath
        };

        ipcRenderer.send('btnclick', arguments);
        start.disabled = true;
    }
});

audioBtn.addEventListener('click', function() {
    let options = {
        defaultPath: 'C:\\Users\\benha\\Desktop\\Electron\\beat-video-app\\Beats',
        filters: [
            { name: 'Audio', extension: ['wav', 'mp3'] }
        ]
    }

    dialog.showOpenDialog(options).then(res => {
        audioFile = res.filePaths[0]
        let parts = audioFile.split('\\');
        document.getElementById('audioFile').textContent = parts[parts.length - 1].split('.')[0];
    });
});

videoBtn.addEventListener('click', function() {
    let options = {
        defaultPath: 'C:\\Users\\benha\\Desktop\\Electron\\beat-video-app\\Videos',
        filters: [
            { name: 'Videos', extension: ['mp4'] }
        ]
    }

    dialog.showOpenDialog(options).then(res => {
        videoFile = res.filePaths[0]
        let parts = videoFile.split('\\');
        document.getElementById('videoFile').textContent = parts[parts.length - 1].split('.')[0];
    });
});

logoBtn.addEventListener('click', function() {
    let options = {
        defaultPath: 'C:\\Users\\benha\\Desktop\\Electron\\beat-video-app\\Static',
        filters: [
            { name: 'Images', extension: ['png'] }
        ]
    }

    dialog.showOpenDialog(options).then(res => {
        logoFile = res.filePaths[0];
        let parts = logoFile.split('\\');
        document.getElementById('logoFile').textContent = parts[parts.length - 1].split('.')[0];
    });
});

outputBtn.addEventListener('click', function() {
    let options = {
        properties: ["openDirectory"],
        defaultPath: 'C:\\Users\\benha\\Google Drive\\Beat Videos'
    }

    dialog.showOpenDialog(options).then(res => {
        outputPath = res.filePaths[0]
        let parts = outputPath.split('\\');
        document.getElementById('outputFolder').textContent = parts[parts.length - 1];
    });
});

audioDefault.addEventListener('click', function() {
    let options = {
        title: 'Set Default Audio File Path',
        properties: ["openDirectory"]
    }

    dialog.showOpenDialog(options).then(res => {

    });
});