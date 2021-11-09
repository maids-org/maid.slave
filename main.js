const { app, BrowserWindow, Menu, Tray, clipboard } = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow = null;

function createWindow () {
  mainWindow = new BrowserWindow({
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

let tray = null
function createTray () {
  tray = new Tray(path.join(__dirname + '/icons/tray', 'tray-osx.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Make slave work', click: function () { mainWindow.show() } },
    { label: 'Hide slave for a while', click: function () { mainWindow.hide() } },
    { label: 'Give a rest to slave', click: function () { app.quit() } },
  ])
  tray.setToolTip('Slave Tooltips.')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
  createTray()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.dock.hide();
