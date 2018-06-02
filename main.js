const {
  app,
  BrowserWindow,
  Menu
} = require('electron');
const path = require('path');
const url = require('url');

const config = {
  url: "http://localhost:8080/#/"
};

let win;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      experimentalFeatures: true
    },
    width: 1000,
    height: 700,
    minHeight: 300,
    minWidth: 920,
    frame: false,
    transparent: false,
    show:false,
    backgroundColor: "#d2d2d2"
  });
  win.loadURL(config.url);

  win.once("ready-to-show", () => {
    win.show();
    win.focus();
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});