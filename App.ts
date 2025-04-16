import {app, BrowserWindow, globalShortcut, shell} from 'electron'
import * as path from 'path';

function createWindow(url: string) {
    console.log(`Opening URL in a new window: ${url}`)
    
    const window = new BrowserWindow()
    window.maximize()
    window.loadURL(url)

    window.webContents.setWindowOpenHandler(({url}) => {
        if (url.includes('google.com') && !url.startsWith('https://www.google.com/url')) {
            createWindow(url)
            return { action: 'deny' }
        } else {
            console.log(`Opening URL in default web browser: ${url}`)
            shell.openExternal(url)
                .then(() => {})
            return { action: 'deny' }
        }
    })

    return window
}

app.on('window-all-closed', () => {
    app.quit()
})

function openNewUrlWindow() {
    console.log(`Opening an empty window.`)
    const window = new BrowserWindow()
    window.maximize()
    window.loadFile(path.join(__dirname, 'new-window.html'))
    window.once('ready-to-show', () => {
        window.show()
        window.webContents.focus()
    })
}

app.whenReady().then(() => {
    createWindow('https://mail.google.com')
    globalShortcut.register('Command+N', openNewUrlWindow)
})
