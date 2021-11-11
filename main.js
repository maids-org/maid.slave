const {
  app,
  Menu,
  Tray,
  dialog,
  nativeImage,
  nativeTheme,
  BrowserWindow,
} = require("electron");
const path = require("path");
const Store = require("./store");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;

const store = new Store({
  configName: "user-preferences",
  defaults: {
    windowLocation: null,
    theme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
  },
});

const darkMode = require("electron").nativeTheme.shouldUseDarkColors;
const lightIcon = nativeImage.createFromPath(
  path.join(__dirname + "/icons/tray", "tray-22.png")
);
const darkIcon = nativeImage.createFromPath(
  path.join(__dirname + "/icons/tray", "tray-dark-22.png")
);

function createWindow() {
  mainWindow = new BrowserWindow({
    x:
      store.get("windowLocation") !== null
        ? store.get("windowLocation")[0]
        : null,
    y:
      store.get("windowLocation") !== null
        ? store.get("windowLocation")[1]
        : null,
    width: 200, // 200, for dev use 800
    height: 200, // 200, for dev use 800
    transparent: true,
    fullscreenable: false,
    backgroundColor: "#01FFFFFF",
    hasShadow: false,
    frame: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html").then();
  mainWindow.setAlwaysOnTop(true);

  // If you need devtools
  // mainWindow.webContents.openDevTools();
}

let tray;
const skins = [
  {
    name: "Trans",
    path: "img/character/subg/",
  },
  {
    name: "Girl",
    path: "img/character/dom/",
  },
  {
    name: "Boi",
    path: "img/character/subb/",
  },
];
let chosenSkin = skins[0];
function createTray() {
  if (darkMode) {
    tray = new Tray(darkIcon);
  } else {
    tray = new Tray(lightIcon);
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Make slave work",
      click: function () {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        } else {
          mainWindow.show();
        }
      },
    },
    {
      label: "Hide slave for a while",
      click: function () {
        if (BrowserWindow.getAllWindows().length === 0) {
          dialog
            .showMessageBox({
              type: "info",
              icon: path.join(__dirname, "icons", "icon.png"),
              message: "I thought we were already playing hide and seek!?",
            })
            .then();
        } else {
          mainWindow.hide();
        }
      },
    },
    {
      label: "Give a rest to slave",
      click: function () {
        app.quit();
      },
    },
    {
      label: "Change skin of slave",
      submenu: skins.map((skin) => {
        return {
          label: skin.name,
          type: "radio",
          click: function () {
            chosenSkin = skin;
            mainWindow.webContents.send("SKIN", skin.path);
          },
          checked: skin === skins[0],
        };
      }),
    },
  ]);
  tray.setToolTip("Slave Tooltips.");
  tray.setContextMenu(contextMenu);
}

function updateMyAppTheme(isDark) {
  tray.setImage(isDark ? darkIcon : lightIcon);
}

app.whenReady().then(() => {
  createTray();
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

nativeTheme.on("updated", function theThemeHasChanged() {
  updateMyAppTheme(nativeTheme.shouldUseDarkColors);
});

app.on("before-quit", function () {
  store.set("windowLocation", mainWindow.getPosition());
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

if (process.platform === "darwin") {
  app.dock.hide();
}
