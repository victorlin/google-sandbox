# Gmail - Electron

## Description
This is my first attempt at creating an Electron application. I really love using the Gmail web interface with the simplify gmail extension, but I do not like it being another tab in the browser. So, this is my attempt at breaking it out into it's own application.

## Notes
This application uses the extension Simplify Gmail which can be downloaded from the Chrome App Store. If you do not have the extension installed then you will get a notification when you start the program. When you click on that notification you will be guided to the correct Chrome App Store page to install the extension.

## To Run:
1. Clone repository
2. Run ```npm install```
3. Run ```npm start```

## To Package for Your Computer:
1. Install 'electron-packager' on your computer with the following command: ```npm install electron-packager -g```
2. From the root directory run: ```electron-packager . --icon './icons/icon.icns'```

This command will create the application and the output will tell you where the application has been placed on your computer. For more options and information on electron-packager look [here](https://github.com/electron/electron-packager)