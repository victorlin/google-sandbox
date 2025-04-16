import {app, BrowserWindow, Menu, MenuItem, shell} from 'electron'
import * as path from 'path';

const menu = new Menu()
menu.append(new MenuItem({
    role: 'appMenu',
}))
menu.append(new MenuItem({
    role: 'fileMenu',
}))
menu.append(new MenuItem({
    role: 'editMenu',
}))
menu.append(new MenuItem({
    role: 'viewMenu',
}))
menu.append(new MenuItem({
    role: 'windowMenu',
}))
menu.append(new MenuItem({
    label: 'Apps',
    submenu: [
        {
            role: 'help',
            label: 'Open Mail',
            accelerator: process.platform === 'darwin' ? 'Cmd+1' : 'Ctrl+1',
            click: () => { createWindow('https://mail.google.com') }
        },
        {
            role: 'help',
            label: 'Open Youtube Studio',
            accelerator: process.platform === 'darwin' ? 'Cmd+2' : 'Ctrl+2',
            click: () => { createWindow('https://studio.youtube.com') }
        },
        {
            role: 'help',
            label: 'Open Calendar',
            accelerator: process.platform === 'darwin' ? 'Cmd+3' : 'Ctrl+3',
            click: () => { createWindow('https://calendar.google.com') }
        },
        {
            role: 'help',
            label: 'Open Maps',
            accelerator: process.platform === 'darwin' ? 'Cmd+4' : 'Ctrl+4',
            click: () => { createWindow('https://maps.google.com') }
        },
    ]
}))

Menu.setApplicationMenu(menu)

function createWindow(url?: string) {
    const window = new BrowserWindow()

    if (url === undefined) {
        console.log(`Opening an empty window.`)
        window.loadFile(path.join(__dirname, 'new-window.html'))
    }
    else {
        console.log(`Opening URL in a new window: ${url}`)
        window.loadURL(url)
        window.maximize()
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
    }

    return window
}

app.on('window-all-closed', () => {
    app.quit()
})

app.whenReady().then(() => {
    createWindow()
})
