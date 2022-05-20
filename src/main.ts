import { app, BrowserWindow, ipcMain } from "electron"

import url = require('url');
import path = require('path');
let spawn = require("child_process").spawn;

const createWindow = () => {
    const win = new BrowserWindow({width: 600, height: 400})
    win.loadURL(url.format ({
        pathname: 'index.html',
        protocol: 'file:',
        slashes: true
     }))
}

app.whenReady().then(() => {
    createWindow()
    docker("images", )
    .then((response: string) => console.log("###################\n" + response + "\n###############################\n"));

})

ipcMain.on('asynchronous-message', (event, arg: string) => {
    console.log('getImages called');
    event.sender.send('asynchronous-reply', 'async pong')
    console.log('getImages 2');
});


function docker(command: string, args: string[] = []): Promise<string> {
    return runProgram("cmd.exe", ["/c", "docker", command, ...args, "--format", "\"{{json . }}\""])
}

function runProgram(programName: string, programArgs: string[]): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
        let process = spawn(programName, programArgs);
        let output: string = '';

        process.stdout.on("data", (data: Buffer) => {
            output += data.toString();
        });
        
        process.stderr.on("data", (data: Buffer) => {
            output += data.toString();
        });
        
        process.on("exit", (code: any) => {
            resolve(output);
        });
      });


    return promise;

}