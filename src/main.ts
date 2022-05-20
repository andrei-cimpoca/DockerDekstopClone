import { app, BrowserWindow } from "electron"

const createWindow = () => {
    const win = new BrowserWindow({width: 600, height: 400})
    win.loadURL("https://google.com")
}

app.whenReady().then(() => {
    createWindow()
})
