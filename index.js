const electron = require('electron');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let coinWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
