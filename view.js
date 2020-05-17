const { ipcRenderer, remote } = require('electron');
const fs = require('fs');

// get main electron information
dialog = remote.dialog;
WIN = remote.getCurrentWindow();

// start button
const btnClick = document.getElementById('start');

// choose file buttons
const audioBtn = document.getElementById('audioButton');
const videoBtn = document.getElementById('videoButton');
const logoBtn = document.getElementById('logoButton');
const outputBtn = document.getElementById('outputButton');

// file default buttons
const audioDefault = document.getElementById('audioDefault');
const videoDefault = document.getElementById('videoDefault');
const logoDefault = document.getElementById('logoDefault');
const outputDefault = document.getElementById('outputDefault');

const preview = document.getElementById('previewImage');
const imgSpinner = document.getElementById('spinner2');
const imgPreview = document.getElementById('imagePreviewDiv');

const audio = document.getElementById('audioController');

// get the JSON file we use for settings
let settings = JSON.parse(fs.readFileSync('settings.json'));

// stores the values of the selected file paths
var audioFile;
var videoFile;
var logoFile;
var outputPath;

btnClick.disabled = true;
// preview.hidden = true;

function updateStartButton() {
    if (audioFile && videoFile && logoFile && outputPath) {
        btnClick.disabled = false;
    } else {
        btnClick.disabled = true;
    }
}

function updatePreview() {
    if (videoFile && logoFile) {
        let args = {
            'video': videoFile,
            'logo': logoFile
        }
        preview.src = ''
        imgSpinner.hidden = false;
        ipcRenderer.send('getPreview', args);
        // imgPreview.style.display = 'block';
    }
}

function updateAudio() {
    if (audioFile) {
        audio.src = audioFile;
    }
}

function updateSettings() {
    let data = JSON.stringify(settings);
    fs.writeFileSync('./settings.json', data);
}

if (settings['defaultLogoFile'] != '') {
    logoFile = settings['defaultLogoFile'];
    let parts = logoFile.split('\\');
    document.getElementById('logoFile').textContent = parts[parts.length - 1];
}

if (settings['defaultOutputPath'] != '') {
    outputPath = settings['defaultOutputPath'];
    let parts = outputPath.split('\\');
    document.getElementById('outputFolder').textContent = parts[parts.length - 1];
}

updateStartButton();

ipcRenderer.on('vidDone', function() {
    console.log('got vid done')
    audioFile = null;
    videoFile = null;
    document.getElementById('logoFile').textContent = 'No file chosen';
    document.getElementById('outputFolder').textContent = 'No folder chosen';
    btnClick.disabled = false;
    audioBtn.disabled = false;
    videoBtn.disabled = false;
    logoBtn.disabled = false;
    outputBtn.disabled = false;
    document.getElementById('spinner').style.visibility = 'hidden';
});

ipcRenderer.on('preview', function(event, args) {
    console.log(args)

    var gif = new Image();
    gif.src = args;
    gif.onload = function() {
        preview.src = gif.src;
        // preview.hidden = false;
        imgSpinner.hidden = true;
    }



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
        btnClick.disabled = true;
        audioBtn.disabled = true;
        videoBtn.disabled = true;
        logoBtn.disabled = true;
        outputBtn.disabled = true;

        document.getElementById('spinner').style.visibility = 'visible';
    }
});

audioBtn.addEventListener('click', function() {
    let options = {
        defaultPath: settings['defaultAudioPath'],
        filters: [
            { name: 'Audio', extension: ['wav', 'mp3'] }
        ]
    }

    dialog.showOpenDialog(options).then(res => {
        audioFile = res.filePaths[0]
        let parts = audioFile.split('\\');
        document.getElementById('audioFile').textContent = parts[parts.length - 1];
        updateStartButton();
        updateAudio()
    });
});

videoBtn.addEventListener('click', function() {
    let options = {
        defaultPath: settings['defaultVideoPath'],
        filters: [
            { name: 'Videos', extension: ['mp4'] }
        ]
    }

    dialog.showOpenDialog(options).then(res => {
        videoFile = res.filePaths[0]
        let parts = videoFile.split('\\');
        document.getElementById('videoFile').textContent = parts[parts.length - 1];
        updateStartButton();
        updatePreview();
    });
});

logoBtn.addEventListener('click', function() {
    let options = {
        defaultPath: settings['defaultLogoPath'],
        filters: [
            { name: 'Images', extension: ['png'] }
        ]
    }

    dialog.showOpenDialog(options).then(res => {
        logoFile = res.filePaths[0];
        let parts = logoFile.split('\\');
        document.getElementById('logoFile').textContent = parts[parts.length - 1];
        updateStartButton();
        updatePreview();
    });
});

outputBtn.addEventListener('click', function() {
    let options = {
        properties: ["openDirectory"],
        defaultPath: settings['defaultOutputPath']
    }

    dialog.showOpenDialog(options).then(res => {
        outputPath = res.filePaths[0]
        let parts = outputPath.split('\\');
        document.getElementById('outputFolder').textContent = parts[parts.length - 1];
        updateStartButton();
    });
});

audioDefault.addEventListener('click', function() {
    let options = {
        title: 'Set Default Audio Folder',
        properties: ["openDirectory"],
        defaultPath: settings['defaultAudioPath']
    }

    dialog.showOpenDialog(options).then(res => {
        settings['defaultAudioPath'] = res.filePaths[0];
        updateSettings();
        updateStartButton();
        updateAudio()
    });
});

videoDefault.addEventListener('click', function() {
    let options = {
        title: 'Set Default Video Folder',
        properties: ["openDirectory"],
        defaultPath: settings['defaultVideoPath']
    }

    dialog.showOpenDialog(options).then(res => {
        settings['defaultVideoPath'] = res.filePaths[0];
        updateSettings();
        updateStartButton();
        updatePreview();
    });
});

logoDefault.addEventListener('click', function() {
    let options = {
        title: 'Set Default Logo File',
        filters: [
            { name: 'Images', extensions: ['png'] }
        ],
        properties: ['openFile'],
        defaultPath: settings['defaultLogoFile']
    }

    dialog.showOpenDialog(options).then(res => {
        settings['defaultLogoFile'] = res.filePaths[0];
        updateSettings();
        logoPath = res.filePaths[0];
        let parts = res.filePaths[0].split('\\');
        document.getElementById('logoFile').textContent = parts[parts.length - 1];
        updateStartButton();
        updatePreview();
    });
});

outputDefault.addEventListener('click', function() {
    let options = {
        title: 'Set Default Output Folder',
        properties: ["openDirectory"],
        defaultPath: settings['defaultOutputPath']
    }

    dialog.showOpenDialog(options).then(res => {
        settings['defaultOutputPath'] = res.filePaths[0];
        updateSettings();
        outputPath = res.filePaths[0];
        let parts = res.filePaths[0].split('\\');
        document.getElementById('outputFolder').textContent = parts[parts.length - 1];
        updateStartButton();
    });
});

document.getElementById('audioButton').addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('reeeeeeeeee')
});