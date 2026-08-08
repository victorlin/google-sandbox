# Google Sandbox

## Description

A lightweight, self-contained browser for Google applications.

## Features

- **Account Management**: Automatically detects Google accounts and allows quick selection on start.
- **Dedicated Apps Menu**: Quick shortcuts to open Mail, Calendar, Drive, Photos, Maps, and more.
- **Smart Link Handling**: Keeps Google links inside the app while opening external links in your default system browser.
- **Link Hover Status**: Displays link URLs on hover in a bottom status bar, just like a standard browser.
- **Context Menu**: Basic context menu support for copying text and links.
- **Forced Dark Mode**: Experimental forced dark mode for Gmail and Voice.
- **Auto-Updates**: Automatically checks for new releases on launch and prompts to download updates.

## Installation

1. Go to the latest [GitHub Release](https://github.com/victorlin/google-sandbox/releases/latest).
2. Download the `.dmg` installer.
3. Open `.dmg` and drag the app to Applications folder.
4. Run `xattr -r -d com.apple.quarantine "/Applications/Google Sandbox.app"` (the app isn't notarized).
5. Open the app.

## Auto-Updates

Google Sandbox automatically checks for new releases on launch. If an update is found, a prompt appears allowing you to download the installer. You can also manually check for updates at any time by selecting **Google Sandbox > Check for Updates...** from the application menu bar.

## Configuration

Google accounts are automatically detected by the app. To add accounts, log in by navigating to any Google service. The app will automatically find your active sessions and add them to your available accounts list on the start page.

(Accounts are stored in your user data directory and sync automatically. If you ever need to view or manually override them, you can still access the "Settings" window from the application menu).

## To Run:
1. Clone repository
2. Run ```npm install```
3. Run ```npm start```

## To Package for Your Computer:
1. Run ```npm run make```
2. Install resulting package in `out/make/**`

## Related projects

- https://github.com/Treadder/G-Switcher
