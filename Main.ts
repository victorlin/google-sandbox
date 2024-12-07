import {BrowserWindow, shell} from 'electron';
import * as path from "path";

function createWindow(url: string) {
    const window = new BrowserWindow({
        title: 'Gmail',
        icon: path.join(Main.application.getAppPath(), 'icons/icon.png')
    });

    window.maximize();

    window.loadURL(url);

    window.webContents.setWindowOpenHandler(({url}) => {
        if (url.includes('google.com') && !url.startsWith('https://www.google.com/url')) {
            console.log(`allow ${url}`)
            createWindow(url);
            return { action: 'deny' }
        } else {
            console.log(`deny ${url}`)
            shell.openExternal(url)
                .then(() => {})
            return { action: 'deny' }
        }
    });

    return window;
}

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    private static onWindowAllClosed() {
        Main.application.quit();
    }

    private static onClose() {
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = createWindow('https://mail.google.com');
        Main.mainWindow.on('closed', Main.onClose);
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
