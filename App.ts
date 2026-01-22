import {app, BrowserWindow, clipboard, ipcMain, Menu, MenuItem, nativeTheme, shell} from 'electron'
import * as path from 'path'
import * as fs from 'fs'

type Settings = {
    googleAccounts: string[]
}

const DEFAULT_SETTINGS: Settings = {
    googleAccounts: []
}

function getSettingsFile(): string {
    const settingsPath = path.join(app.getPath('userData'), 'settings.json')

    if (!fs.existsSync(settingsPath)) {
        console.log(`Creating new settings file: ${settingsPath}`)
        fs.writeFileSync(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2))
    }

    return settingsPath
}

function getSettings(): Settings {
    try {
        const file = getSettingsFile()
        const contents = fs.readFileSync(file)
        const settings = JSON.parse(contents.toString())
        return {
            ...DEFAULT_SETTINGS,
            ...settings,
        }
    } catch (error) {
        console.error('Failed to read or parse settings file:', error)
        return { ...DEFAULT_SETTINGS }
    }
}

function saveSettings(settings: Settings): void {
    try {
        const settingsFile = getSettingsFile()
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2))
        console.log('Saved settings to file:', settings)
    } catch (error) {
        console.error('Failed to save settings to file:', error)
        throw error
    }
}

let selectedAccount: string | null = null
let startWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null

// Listen for the selected account from the renderer process
ipcMain.on('set-selected-account', (event, account) => {
    console.log('Selected account received in main:', account)
    selectedAccount = account
})

ipcMain.handle('get-settings', async () => {
  return getSettings();
});

ipcMain.handle('save-settings', async (event, newSettings: Settings) => {
  try {
    const oldSettings = getSettings();
    saveSettings({ ...oldSettings, ...newSettings });
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error: String(error) };
  }
});

// IPC handler for renderer to open settings window
ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

// IPC handler for context menu
ipcMain.on('show-context-menu', (event, context) => {
    const { selectedText, linkUrl } = context
    const menuItems: MenuItem[] = []

    if (selectedText) {
        menuItems.push(new MenuItem({
            label: 'Copy',
            click: () => clipboard.writeText(selectedText)
        }))
    }

    if (linkUrl) {
        menuItems.push(new MenuItem({
            label: 'Copy Link',
            click: () => clipboard.writeText(linkUrl)
        }))
    }

    if (menuItems.length > 0) {
        const contextMenu = Menu.buildFromTemplate(menuItems)
        contextMenu.popup()
    }
})

// IPC handlers for link hover status bar
ipcMain.on('show-link-hover', (event, url) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
        window.webContents.executeJavaScript(`
            (function() {
                const statusBar = document.getElementById('electron-link-status-bar');
                if (statusBar) {
                    statusBar.textContent = ${JSON.stringify(url)};
                    statusBar.style.display = 'block';
                }
            })();
        `)
    }
})

ipcMain.on('hide-link-hover', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
        window.webContents.executeJavaScript(`
            (function() {
                const statusBar = document.getElementById('electron-link-status-bar');
                if (statusBar) {
                    statusBar.style.display = 'none';
                }
            })();
        `)
    }
})

const menu = new Menu()
menu.append(new MenuItem({
    role: 'appMenu',
    submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
            label: 'Settings',
            accelerator: process.platform === 'darwin' ? 'Cmd+,' : 'Ctrl+,',
            click: () => { createSettingsWindow() }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
    ]
}))
menu.append(new MenuItem({
    role: 'fileMenu',
}))
menu.append(new MenuItem({
    role: 'editMenu',
}))
menu.append(new MenuItem({
    role: 'viewMenu',
    submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
            label: 'Back',
            accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Alt+Left',
            click: () => BrowserWindow.getFocusedWindow()?.webContents.navigationHistory.goBack()
        },
        {
            visible: false,
            label: 'Back',
            accelerator: 'Cmd+Left',
            click: () => BrowserWindow.getFocusedWindow()?.webContents.navigationHistory.goBack()
        },
        {
            label: 'Forward',
            accelerator: process.platform === 'darwin' ? 'Cmd+]' : 'Alt+Right',
            click: () => BrowserWindow.getFocusedWindow()?.webContents.navigationHistory.goForward()
        },
        {
            visible: false,
            label: 'Forward',
            accelerator: 'Cmd+Right',
            click: () => BrowserWindow.getFocusedWindow()?.webContents.navigationHistory.goForward()
        }
    ]
}))
menu.append(new MenuItem({
    role: 'windowMenu',
}))
menu.append(new MenuItem({
    label: 'Apps',
    submenu: [
        {
            role: 'help',
            label: 'Open Account Selection',
            accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
            click: () => { createWindow() }
        },
        {
            role: 'help',
            label: 'Open Mail',
            accelerator: process.platform === 'darwin' ? 'Cmd+1' : 'Ctrl+1',
            click: () => {
                let url = 'https://mail.google.com'
                if (selectedAccount) {
                    url = `https://mail.google.com/mail/u/?authuser=${selectedAccount}`
                }
                createWindow({ url, useDarkFallback: true })
            }
        },
        {
            role: 'help',
            label: 'Open Calendar',
            accelerator: process.platform === 'darwin' ? 'Cmd+2' : 'Ctrl+2',
            click: () => {
                let url = 'https://calendar.google.com/calendar'
                if (selectedAccount) {
                    url = `https://calendar.google.com/calendar/u/?authuser=${selectedAccount}`
                }
                createWindow({ url })
            }
        },
        {
            role: 'help',
            label: 'Open Voice',
            accelerator: process.platform === 'darwin' ? 'Cmd+3' : 'Ctrl+3',
            click: () => {
                let url = 'https://voice.google.com/'
                if (selectedAccount) {
                    url = `https://voice.google.com/u/?authuser=${selectedAccount}`
                }
                createWindow({ url })
            }
        },
        {
            role: 'help',
            label: 'Open Drive',
            accelerator: process.platform === 'darwin' ? 'Cmd+4' : 'Ctrl+4',
            click: () => {
                let url = 'https://drive.google.com/'
                if (selectedAccount) {
                    url = `https://drive.google.com/u/?authuser=${selectedAccount}`
                }
                createWindow({ url })
            }
        },
        {
            role: 'help',
            label: 'Open Photos',
            accelerator: process.platform === 'darwin' ? 'Cmd+5' : 'Ctrl+5',
            click: () => {
                let url = 'https://photos.google.com/'
                if (selectedAccount) {
                    url = `https://photos.google.com/u/?authuser=${selectedAccount}`
                }
                createWindow({ url })
            }
        },
        {
            role: 'help',
            label: 'Open Youtube Studio',
            accelerator: process.platform === 'darwin' ? 'Cmd+6' : 'Ctrl+6',
            click: () => { createWindow({ url: 'https://studio.youtube.com' }) }
        },
        {
            role: 'help',
            label: 'Open Maps',
            accelerator: process.platform === 'darwin' ? 'Cmd+7' : 'Ctrl+7',
            click: () => { createWindow({ url: 'https://maps.google.com' }) }
        },
    ]
}))

Menu.setApplicationMenu(menu)

function createWindow({ url, useDarkFallback = false }: { url?: string; useDarkFallback?: boolean } = {}) {
    const window = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        }
    });

    // Conditionally inject fallback dark-mode CSS
    window.webContents.on('did-finish-load', () => {
      if (useDarkFallback && nativeTheme.shouldUseDarkColors) {
        window.webContents.insertCSS(`
          html {
            filter: invert(100%) hue-rotate(180deg) brightness(0.9) contrast(1.2) !important;
            background: #121212 !important;
          }
          img, video, [style*="background-image"] {
            filter: invert(100%) hue-rotate(180deg) !important;
          }
        `);
      }

      // Inject status bar for link hover display
      window.webContents.executeJavaScript(`
        if (!document.getElementById('electron-link-status-bar')) {
          const statusBar = document.createElement('div');
          statusBar.id = 'electron-link-status-bar';
          statusBar.style.cssText = 'position: fixed; bottom: 0; left: 0; z-index: 999999; background: rgba(0, 0, 0, 0.8); color: white; padding: 4px 8px; font-size: 12px; font-family: system-ui, -apple-system, sans-serif; display: none; max-width: 80%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
          document.body.appendChild(statusBar);
        }
      `);
    });

    if (url === undefined) {
        console.log(`Opening the start window.`)
        window.loadFile(path.join(__dirname, 'start.html'))
        startWindow = window
    }
    else {
        console.log(`Opening URL in a new window: ${url}`)
        // Close the start window if it exists
        if (startWindow && !startWindow.isDestroyed()) {
            startWindow.close()
            startWindow = null
        }
        window.loadURL(url)
        window.maximize()
        window.webContents.setWindowOpenHandler(({ url: newUrl }) => {
            const url = new URL(newUrl);
            const isShiftClick = url.searchParams.get('_shiftClick') === '1';

            if (isShiftClick) {
                // Remove the marker parameter and open in app window
                url.searchParams.delete('_shiftClick');
                const finalUrl = url.toString();
                createWindow({ url: finalUrl });
                return { action: 'deny' };
            }

            if (newUrl.includes('google.com') && !newUrl.startsWith('https://www.google.com/url')) {
                // When opening subsequent google.com links, we should also append the authuser
                let finalNewUrl = newUrl
                if (selectedAccount && (newUrl.includes('mail.google.com') || newUrl.includes('calendar.google.com'))) {
                    if (newUrl.includes('?')) {
                        finalNewUrl += `&authuser=${selectedAccount}`
                    } else {
                        finalNewUrl += `?authuser=${selectedAccount}`
                    }
                }
                createWindow({ url: finalNewUrl })
                return { action: 'deny' }
            } else {
                console.log(`Opening URL in default web browser: ${newUrl}`)
                shell.openExternal(newUrl)
                    .then(() => {})
                    .catch(err => console.error('Failed to open external URL:', err))
                return { action: 'deny' }
            }
        })
    }

    return window
}

function createSettingsWindow() {
    // Don't open multiple settings windows
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.focus()
        return
    }

    settingsWindow = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Settings'
    })

    settingsWindow.loadFile(path.join(__dirname, 'settings.html'))

    settingsWindow.on('closed', () => {
        settingsWindow = null
        if (startWindow && !startWindow.isDestroyed()) {
            startWindow.webContents.send('reload-settings')
        }
    })
}

app.on('window-all-closed', () => {
    app.quit()
})

app.whenReady().then(() => {
    createWindow()
})
