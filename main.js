const { app, BrowserWindow, session } = require('electron')
const os = require('os')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    title: 'Gmail',
    webPreferences: {
      nodeIntegration: true,
    },
  })

  win.loadURL('https://www.gmail.com')
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    require('electron').shell.openExternal(url)
  })
}

app.on('ready', async () => {
  try {
    createWindow()
    await session.defaultSession.loadExtension(path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/pbmlfaiicoikhdbjagjbglnbfcbcojpj/1.7.17_0/'))
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
