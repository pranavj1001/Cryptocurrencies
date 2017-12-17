const electron = require('electron');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let coinWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  coinWindow = new BrowserWindow({});
  coinWindow.loadURL(`file://${__dirname}/coin.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('coin:select', (event, coinData) => {
  mainWindow.close();
  coinWindow.webContents.send('coin:data', coinData);
});
