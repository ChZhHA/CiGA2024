import { app, BrowserWindow, screen, ipcMain, session } from "electron";
import path from "path";
ipcMain.on("set-ignore-mouse-events", (event, ...args) => {
    // @ts-ignore
    BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(...args);
});
ipcMain.on("set-always-on-top", (event, ...args) => {
    // @ts-ignore
    BrowserWindow.fromWebContents(event.sender).setAlwaysOnTop(...args);
});
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const getScreenSize = () => {
    const { width, height } = screen.getPrimaryDisplay().size;
    return { width, height };
};

const createWindow = () => {
    // Create the browser window.
    session.defaultSession.protocol.registerFileProtocol("static", (request: any, callback: any) => {
        const fileUrl = request.url.replace("static://", "");
        let filePath = "";
        if (process.env.NODE_ENV === "development") {
            filePath = path.join("./", fileUrl);
        } else {
            filePath = path.join(path.dirname(app.getPath("exe")), "resources", fileUrl);
        }
        callback(filePath);
    });
    const size = getScreenSize();
    const mainWindow = new BrowserWindow({
        width: size.width - 100,
        height: 250,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },

        x: 50,
        y: size.height - 250,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
    });
    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
    // mainWindow.alway
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    // mainWindow.setIgnoreMouseEvents(true);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
