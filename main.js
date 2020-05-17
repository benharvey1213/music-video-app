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
    // console.log('directories selected', result.filePaths)
});

ipcMain.on('btnclick', function(event, arg) {
    // console.log(arg)

    var python = require('child_process').spawn('python', ['video_maker.py', arg['videoPath'], arg['audioPath'], arg['logoPath'], arg['outputPath']]);
    python.stdout.on('data', function(data) {
        if (data.includes('Video ready:')) {
            event.reply('vidDone');
        }
        console.log(data.toString('utf8'))
    });
});

ipcMain.on('getPreview', function(event, data) {
    // win.setSize(800, 700)
    var python = require('child_process').spawn('python', ['preview.py', data['video'], data['logo']]);
    python.stdout.on('data', function(data) {
        if (data.includes('.gif')) {
            args = { 'path': data.toString('utf8') }
            event.sender.send('preview', data.toString('utf8'));
        }
        // console.log(data.toString('utf8'))
    });
});