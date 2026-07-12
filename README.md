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

Google accounts are set within the app. When you first run the app, click the "Settings" button on the start page to add, edit, or remove accounts.

Accounts are stored in your user data directory and persist across app updates.

## To Run:
1. Clone repository
2. Run ```npm install```
3. Run ```npm start```

## To Package for Your Computer:
1. Run ```npm run make```
2. Install resulting package in `out/make/**`
