import { app, BrowserWindow } from "electron"

const url = require('url')
const path = require('path')
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
    runProgram("cmd.exe", ["/c", "C:/Users/andrei.cimpoca/bin/docker.bat", "images"])
    .then((response: string) => console.log("###################\n" + response + "\n###############################\n"));

})


function runProgram(programName: string, programArgs: string[]): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
        // let process = spawn("cmd.exe", ["/c", "C:/Users/andrei.cimpoca/bin/docker.bat", "images"]);
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