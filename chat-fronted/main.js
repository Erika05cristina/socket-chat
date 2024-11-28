const { app, BrowserWindow } = require('electron');
const path = require('path');

// Crear la ventana principal
let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'), // Precargar lógica
            nodeIntegration: true, // Habilitar Node.js
        },
    });

    mainWindow.loadFile('index.html'); // Cargar la interfaz
});
