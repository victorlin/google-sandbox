const { app, BrowserWindow, session, Notification } = require('electron')
const os = require('os')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    title: 'Gmail',
  })

  win.loadURL('https://www.gmail.com')
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    require('electron').shell.openExternal(url)
  })
}

app.on('ready', async () => {
  createWindow()
  try {
    if (process.platform === 'darwin'){
      await session.defaultSession.loadExtension(path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/pbmlfaiicoikhdbjagjbglnbfcbcojpj/1.7.17_0/'))
    } else if (process.platform === 'win32') {
      await session.defaultSession.loadExtension("%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Extensions\\pbmlfaiicoikhdbjagjbglnbfcbcojpj\\1.7.17_0\\")
    }
  } catch(e) {
    // console.log(e)
    if (Notification.isSupported()) {
      const notify = new Notification({title: 'Error Loading Simplify Gmail Extension', body: 'Click this notification to install Simplify Gmail extension'})
      notify.show()
      notify.on('click', () => require('electron').shell.openExternal('https://chrome.google.com/webstore/detail/simplify-gmail/pbmlfaiicoikhdbjagjbglnbfcbcojpj'))
    } else {
      console.log(e)
    }
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
