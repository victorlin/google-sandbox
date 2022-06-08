import {BrowserWindow, shell} from 'electron';
import * as path from "path";

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({
            width: 1300, height: 900,
            title: 'Gmail',
            icon: path.join(Main.application.getAppPath(), 'icons/icon.png')
        });

        Main.mainWindow.loadURL('https://mail.google.com')
            .then(() => {});

        Main.mainWindow.webContents.setWindowOpenHandler(({url}) => {
            shell.openExternal(url)
                .then(() => {})
            return { action: 'deny' }
        })

        Main.mainWindow.on('closed', Main.onClose);
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
