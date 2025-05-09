const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setSelectedAccount: (account) => ipcRenderer.send('set-selected-account', account),
    getGoogleAccounts: () => ipcRenderer.invoke('get-google-accounts')
});
