const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const os = require('os')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  win.loadURL('https://www.gmail.com')
  //~/Library/Application Support/Google/Chrome/Default/Extensions/pbmlfaiicoikhdbjagjbglnbfcbcojpj
}
app.whenReady().then(createWindow).catch(e => console.log(e))
app.on('ready', async () => {
  try {
    await session.defaultSession.loadExtension('./extensions/simplify_gmail/')
  } catch(e) {
    console.log(e)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
