const electron = require('electron')
const { app, BrowserWindow, dialog, ipcMain } = require('electron');

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // win.removeMenu()
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
    console.log('directories selected', result.filePaths)
});

ipcMain.on('btnclick', function(event, arg) {
    // console.log(arg);

    // let arguments = {
    //     'audioPath': file1.files[0].path,
    //     'videoPath': file2.files[0].path,
    //     'logoPath': file3.files[0].path,
    //     'videoName': vidName.value.trim(),
    //     'username': username.value.trim(),
    //     'password': password.value.trim()
    // };

    console.log(arg)

    var python = require('child_process').spawn('python', ['video_maker.py', arg['videoPath'], arg['audioPath'], arg['logoPath'], arg['outputPath']]);
    python.stdout.on('data', function(data) {
        // if (data.includes('Video ready:')) {
        //     console.log('vid ready')
        // }
        console.log(data.toString('utf8'))
    });
});