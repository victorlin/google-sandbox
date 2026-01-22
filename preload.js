const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setSelectedAccount: (account) => ipcRenderer.send('set-selected-account', account),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    showContextMenu: (context) => ipcRenderer.send('show-context-menu', context),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    openSettings: () => ipcRenderer.send('open-settings'),
    onReloadSettings: (callback) => ipcRenderer.on('reload-settings', callback)
});

// Intercept shift-clicked links to add a marker for the main process
window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        if (event.shiftKey) {
            const target = event.target.closest('a');
            if (target && target.href) {
                event.preventDefault();
                const url = new URL(target.href);
                url.searchParams.set('_shiftClick', '1');
                window.open(url.toString(), target.target || '_blank');
            }
        }
    }, true);

    // Handle right-click context menu
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        const context = {
            selectedText: window.getSelection().toString().trim(),
            linkUrl: null
        };

        // Check if right-clicking on a link
        const target = event.target.closest('a');
        if (target && target.href) {
            context.linkUrl = target.href;
        }

        ipcRenderer.send('show-context-menu', context);
    }, true);

    // Handle link hover to show URL in status bar
    document.addEventListener('mouseover', (event) => {
        const target = event.target.closest('a');
        if (target && target.href) {
            ipcRenderer.send('show-link-hover', target.href);
        }
    }, true);

    document.addEventListener('mouseout', (event) => {
        const target = event.target.closest('a');
        if (target && target.href) {
            ipcRenderer.send('hide-link-hover');
        }
    }, true);
});
