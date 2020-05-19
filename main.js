const electron = require('electron')
const { app, BrowserWindow, dialog, ipcMain } = require('electron');

var win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 550,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.removeMenu()
    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

ipcMain.on('select-dirs', async(event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
});

ipcMain.on('btnclick', function(event, arg) {
    var python = require('child_process').spawn('python', ['video_maker.py', arg['videoPath'], arg['audioPath'], arg['logoPath'], arg['outputPath']]);
    python.stdout.on('data', function(data) {
        if (data.includes('video ready')) {
            event.sender.send('vidDone');
            win.setProgressBar(-1);
        }
    });
    python.stderr.on('data', function(data) {
        // console.log(data.toString('utf8'))
        if (data.includes('t:')) {
            let percent = data.toString('utf8').split('%')[0].split('t:')[1].trim();
            win.setProgressBar(percent / 100);
            event.sender.send('exportPercent', percent);
        }
    });
});

ipcMain.on('getPreview', function(event, data) {
    var python = require('child_process').spawn('python', ['preview.py', data['video'], data['logo']]);
    python.stdout.on('data', function(data) {
        if (data.includes('.gif') && !data.includes('Building')) {
            args = { 'path': data.toString('utf8') }
            event.sender.send('preview', data.toString('utf8'));
        }
        // console.log(data.toString('utf8'))
    });
    python.stderr.on('data', function(data) {
        if (data.includes('t:')) {
            event.sender.send('previewPercent', data.toString('utf8').split('%')[0].split('t:')[1].trim());
        }
        // console.log(data.toString('utf8'))
    });
});

// ipcMain.on('ondragstart', (event, filePath) => {
//     console.log('asdlfkajsd;fkjasd;ffkjasdf')
//     event.sender.startDrag({
//         file: filePath,
//         icon: './cog.png'
//     })
// });