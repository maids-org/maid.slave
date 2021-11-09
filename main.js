const {app, BrowserWindow} = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    fullscreenable: false,
    backgroundColor: '#01FFFFFF',
    hasShadow: false,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html').then(r => console.log(r))
  mainWindow.setAlwaysOnTop(true);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.dock.hide();
