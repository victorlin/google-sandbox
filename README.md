# Google Sandbox

## Description

A lightweight, self-contained browser for Google applications.

## Installation

1. Go to the latest [CI run on the default branch](https://github.com/victorlin/google-sandbox/actions/workflows/ci.yml?query=branch%3Amain).
2. Download the "app" artifact.
3. Open `.dmg` and drag the app to Applications folder.
4. Run `xattr -r -d com.apple.quarantine "/Applications/Google Sandbox.app"` (the app isn't notarized).
5. Open the app.

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
