import {app, BrowserWindow, shell} from 'electron'

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

app.whenReady().then(() => {
    createWindow('https://mail.google.com')
})
